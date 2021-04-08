new Vue({
  el: '#app',
  data: {
    title: 'Nestjs Websockets Chat',
    name: '',
    text: '',
    typing: '',
    messages: [],
    onliners: new Map(),
    onlinersArr: [],
    socket: null,
  },
  methods: {
    enterName() {
      this.socket.emit('wentOnline', this.name);
    },

    sendMessage() {
      if (this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text,
        };
        this.socket.emit('msgToServer', message);
        this.text = '';
      }
    },

    receivedMessage(message) {
      this.messages.push(message);
    },

    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    },

    typeMessage() {
      this.socket.emit('isTyping', this.name);
    },
  },

  created() {
    this.socket = io('http://localhost:3000');

    this.socket.on('loadOnliners', (roomSockets) => {
      this.onlinersArr = Object.keys(roomSockets);
      if (this.socket.id in roomSockets) {
        // if (this.name) {
        //   this.onliners[this.socket.id] = this.name;
        // }
        // this.onlinersArr = Object.values(this.onliners);
        // console.log(this.onlinersArr);
      }
    });

    this.socket.on('msgToClient', (message) => {
      this.receivedMessage(message);
    });

    this.socket.on('isTypingToClient', (username) => {
      if (this.name !== username) {
        this.typing = `${username} is typing...`;
        setTimeout(() => {
          this.typing = '';
        }, 2500);
      }
    });
  },
});
