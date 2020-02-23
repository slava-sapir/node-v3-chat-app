    const socket = io()//{transports: ['websocket'], upgrade: false});
    const $messageForm = document.querySelector('#message-form')
    const $messageFormInput = $messageForm.querySelector('input')
    const $messageFormButton = $messageForm.querySelector('button')
    const $sendLocationButton = document.querySelector('#send-location')
    const $side_bar = document.querySelector('#chat__bar')
    const $messages = document.querySelector('#messages')
    const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
    
    
    const tagGenerator = (message) => {
        const myTag = `<div class="message">
          <p>
            <span class="message__name">${message.username} at</span>
            <span class="message__meta">${moment(message.createdAt).format('h:mm a')}:</span>
            <span class="message__name"> ${message.text}</span>
          </p>
         </div>`

        return myTag
    }

    const autoscroll = () => {
        // New message element
        const $newMessage = $messages.lastElementChild
    
        // Height of the new message
        const newMessageStyles = getComputedStyle($newMessage)
        const newMessageMargin = parseInt(newMessageStyles.marginBottom)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    
        // Visible height
        const visibleHeight = $messages.offsetHeight
    
        // Height of messages container
        const containerHeight = $messages.scrollHeight
    
        // How far have I scrolled?
        const scrollOffset = $messages.scrollTop + visibleHeight
    
        if (containerHeight - newMessageHeight >= scrollOffset) {
            $messages.scrollTop = $messages.scrollHeight
        }
    }
    
    

    socket.on('message', (message) => {
        const myTag = tagGenerator(message)
        $('#messages').append($(myTag))
        autoscroll()
    //     $('#chat-messages').append($('<li>').text(`User #${message.count} 
    //     - created at ${moment(message.createdAt).format('h:mm a')}:`))
    //     $('#chat-messages').append($('<p>')
    //    .text(`Message: ${message.text}`))
       
    })

    socket.on('location-sharing', (message) => {
        const url = message.url
        const username = message.username
        const text = message.text
        const createdAt =`${moment(message.createdAt).format('h:mm a')}`
        const myTag = `<div class="message">
        <p>
        <span class="message__name">${username} at</span>
        <span class="message__meta">${createdAt}:</span>
        <span class="message__meta"><a href="${url}" target="_blank">${text}</a></span>
        </p>
        </div>` 
        $('#messages').append($(myTag))
        autoscroll()
    //     $('#chat-messages').append($('<li>')
    //    .text(`Message from user #${messages.count} - created at ${moment(messages.createdAt).format('h:mm a')} :`))
    //     $('#chat-messages').append($('<p>').append($(`<a href=${messages.url} target="_blank">`)
    //    .text(`${messages.text}`)))

     })

     socket.on('roomData', ({ room, users }) => {
         const names = users.map(person => `<li>${person.username}</li>`).join("\n")
         const roomTag =`<h2 class="room-title">Room: ${room}</h2>
         <h3 class="list-title">Users: </h3>
         <ul class="users">${names}</ul>`
         //$('#chat__bar').append($(roomTag)) or like expression below
         $side_bar.innerHTML = roomTag
       
     })

    $messageForm.addEventListener('submit', (e) => {
        e.preventDefault()
        $messageFormButton.setAttribute('disabled', 'disabled')
        
        const client = {
            message: e.target.elements.message.value
        }
        
        socket.emit('sendMessage', client, (error) => {
            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()

            if(error){
                return console.log(error)
            }
            
            $('#messages').append($('<p>').text('Message delivered!'))
        })
        
    })
  
    $sendLocationButton.addEventListener('click', (e) => {
      e.preventDefault()
      $sendLocationButton.setAttribute('disabled', 'disabled')
       if(!navigator.geolocation){
           alert("Your browser doesn't support geolocation!")
        }
          navigator.geolocation.getCurrentPosition((position) => {

              socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude }, (error)=> {
                    if(error){
                        return console.log(error)
                    }
                    $sendLocationButton.removeAttribute('disabled')
                    //console.log('Location shared!')
                    $('#messages').append($('<p>').text('Location shared!'))
                }) 
       })   
  })      

 socket.emit('join', { username, room}, (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
   
 })
