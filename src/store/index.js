import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

const remote = window.require("electron").remote
const dialog = remote.dialog
const fs = remote.require('fs');

Vue.use(Vuex)

export default new Vuex.Store({

  plugins: [createPersistedState()],

  state: {
    deck: {},
    path: '',
  },
  mutations: {

    loadData(context,payload){
      context.deck = payload.deck;
      context.path = payload.path;
      console.log(payload.deck)
      console.log(context)
      console.log('Wczytywanie: ' + payload.path)
    },

    incrementIDC(context){
      context.deck.idc += 1;
    },

    addCard(context, card){
      console.log(context.deck.cards)
      //check if update or save new card
      let ce = context.deck.cards.findIndex(c => c.id == card.id)
      if(ce == -1){
        
        context.deck.cards.push(card);
        context.deck.idc += 1;
      }
      else{
        console.log('edit')
        context.deck.cards[ce] = card;
      }
     
      //update heroes list
      if(card.hero){
        let ce = context.deck.heroes.findIndex(c => c.id == card.id)
        if(ce == -1){
          context.deck.heroes.push({name: card.name, id: card.id})
        }
        else{
          context.deck.heroes[ce] = {name: card.name, id: card.id};
        }

      }
      else{
        let ce = context.deck.heroes.findIndex(c => c.id == card.id)
        if(ce != -1){
          context.deck.heroes.splice(ce, 1);
        }
      }
    },

    removeCard(context, id){
      console.log(context)
      let ce = context.deck.cards.findIndex(c => c.id == id);
      console.log('remove indexes')
      console.log(ce)
      if(ce != -1){
        context.deck.cards.splice(ce, 1);
      }
      console.log('remove H indexes')
      console.log(ce)
      let ch = context.deck.heroes.findIndex(c => c.id == id)
      if(ch != -1){
        context.deck.heroes.splice(ch, 1);
      }
      //search other cards if they are in sub-deck of deleted card
      //and change them to be accesible for whole deck 
      context.deck.cards.forEach(card => {
        if(card.card_deck == id){
          card.card_deck = -1;
        }
      });
    }

  },
  actions: {
    loadLocation(context){
      return new Promise(function(resolve,reject){
        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory'],
          title: 'Wybierz folder w którym znajduje się deck',
          buttonLabel: 'To chyba to',
          }).then(path => {
            console.log(path.filePaths[0])
            path = path.filePaths[0];
            let deckAccepted;
            if (path !== undefined) {
              deckAccepted = context.dispatch('checkLoadedDeck', path);
            }
            else{
              dialog.showMessageBoxSync(remote.getCurrentWindow(), {
                type: 'warning',
                title: 'Błąd',
                message: 'Nie wskazano prawidłowej lokalizacji pliku (Błąd: 10)',
              })
              reject();
            }
            if(deckAccepted){
              resolve(true);
            }
        });
      });
      
    },

    chooseAvatar(){

     let path = dialog.showOpenDialogSync({
      properties: ['openFile',],
      filters: [
        { name: 'Zajebiste avatary', extensions: ['jpg', 'png', 'gif', 'jpeg', 'svg', 'bmp'] },
      ],
      title: 'Wybierz avatar dla karty',
      buttonLabel: 'Biere to',
      });
      console.log(path)
      if (path !== undefined) {
        path = path[0];
        return path
      }
      else{
        dialog.showMessageBoxSync(remote.getCurrentWindow(), {
          type: 'warning',
          title: 'Błąd',
          message: 'Nie wskazano prawidłowej lokalizacji pliku (Błąd: 10)',
        })
      }
    },

    newDeck(context, name){
      return new Promise(function(resolve,reject){
        dialog.showOpenDialog({
          properties: ['openDirectory', 'createDirectory'],
          title: 'Wybierz folder w którym ma zostać utworzony deck',
          buttonLabel: 'Stwórz tutaj',
          }).then(path => {
            console.log(path.filePaths[0])
            path = path.filePaths[0];
            if (path !== undefined) {
              let deck = {
                "name": name,
                "type": "PK_deck",
                "idc": 1,
                "cards": [],
                "heroes": []
              }
              let deckAccepted = false;
              let newDeck = {};
              try{
                //newDeck = JSON.parse(deck);
                newDeck = JSON.stringify(deck);
                console.log(newDeck)
                let dir = path + '\\' + name;
                console.log(dir)
                if (!fs.existsSync(dir)){
                  fs.mkdirSync(dir);
                }
                fs.mkdirSync(dir + '\\assets');
                fs.mkdirSync(dir + '\\assets\\images');
                fs.mkdirSync(dir + '\\assets\\sounds');
                fs.writeFileSync(dir + '/deck.json', newDeck, 'utf-8');
                deckAccepted = context.dispatch('checkLoadedDeck', dir);
                if(deckAccepted){
                  resolve(true);
                }
                else{
                  reject();
                }
              } catch(err){
                dialog.showMessageBoxSync(remote.getCurrentWindow(), {
                  type: 'warning',
                  title: 'Błąd',
                  message: 'Nie wskazano prawidłowej lokalizacji pliku (Błąd: 10)',
                })
                reject();
              }
            }
            else{
              dialog.showMessageBoxSync(remote.getCurrentWindow(), {
                type: 'warning',
                title: 'Błąd',
                message: 'Nie wskazano prawidłowej lokalizacji pliku (Błąd: 10)',
              })
              reject();
            }
           
        });
      });
    },


    chooseSound(){

      let path = dialog.showOpenDialogSync({
       properties: ['openFile',],
       filters: [
         { name: 'Dźwięki z szafy', extensions: ['mp3', 'ogg', 'wav'] },
       ],
       title: 'Wybierz dźwięk dla karty',
       buttonLabel: 'Biere to',
       });
       console.log(path)
       if (path !== undefined) {
         path = path[0];
         return path
       }
       else{
         dialog.showMessageBoxSync(remote.getCurrentWindow(), {
           type: 'warning',
           title: 'Błąd',
           message: 'Nie wskazano prawidłowej lokalizacji pliku (Błąd: 10)',
         })
       }
     },

    checkLoadedDeck(context,path){
      let deck_data;
      console.log(path);
      try{
        let raw_data = fs.readFileSync(path + '/deck.json'); //load data from deck config file
        deck_data = JSON.parse(raw_data);

      } catch (err){
        dialog.showMessageBox(remote.getCurrentWindow(), {
          type: 'warning',
          title: 'Błąd',
          message: err.name + ': ' + err.message,
        })
        return false;
      }
      console.log('3')
      try{
        if(deck_data['type'] === 'PK_deck'){
          let payload = {'path': path, 'deck': deck_data}
          context.commit('loadData', payload )
        }
        else{
          dialog.showMessageBoxSync(remote.getCurrentWindow(), {
            type: 'warning',
            title: 'Błąd',
            message: 'Lokalizacja nie zawiera decku lub wskazany typ decku jest nieobsługiwany (Błąd: 12)',
          })
          return false;
        }
      }catch (err){
        dialog.showMessageBoxSync(remote.getCurrentWindow(), {
          type: 'warning',
          title: 'Błąd',
          message: 'Lokalizacja nie zawiera decku lub wskazany typ decku jest nieobsługiwany (Błąd: 12)',
        })
        return false;
      }
      
      return true;
    },


    saveCard(context,data){

      //copy avatar to images if provided
      if(data.apath != ''){
        let path = data.apath;
        let name = path.replace(/^.*[\\\\/]/, '');
        let re = /(?:\.([^.]+))?$/;
        let extension =  re.exec(name)[1];
        if(extension == undefined){
          dialog.showMessageBoxSync(remote.getCurrentWindow(), {
            type: 'warning',
            title: 'Błąd przy kopiowaniu plików karty.',
            message: 'Wystąpił błąd przy kopiowaniu plików karty. Nie rozpoznano rozszerzenia pliku graficznego',
          })
          return false;
        }
        console.log('name: ' + name + '  extension: ' + extension)
        let dest = context.state.path + '\\assets\\images\\' + data.card.id + '.' + extension;
        let result = true;
        try{
          fs.copyFileSync(path, dest )
        }catch(err){
          result = false;
            if(err){
              dialog.showMessageBoxSync(remote.getCurrentWindow(), {
                type: 'warning',
                title: 'Błąd przy kopiowaniu plików karty',
                message: err.name + ': ' + err.message,
              })
            }

        }
        if(!result){
          return false;
        }
        data.card.avatar = data.card.id + '.' + extension;
      }
        
      //copy sound to sounds if provided
      if(data.spath != ''){
        let path = data.spath;
        let name = path.replace(/^.*[\\\\/]/, '');
        let re = /(?:\.([^.]+))?$/;
        let extension =  re.exec(name)[1];
        if(extension == undefined){
          dialog.showMessageBoxSync(remote.getCurrentWindow(), {
            type: 'warning',
            title: 'Błąd przy kopiowaniu plików karty.',
            message: 'Wystąpił błąd przy kopiowaniu plików karty. Nie rozpoznano rozszerzenia pliku dźwiękowego',
          })
          return false;
        }
        let dest = context.state.path + '\\assets\\sounds\\' + data.card.id + '.' + extension;
        let result = true;
        try{
          fs.copyFileSync(path, dest )
        }catch(err){
          result = false;
            if(err){
              dialog.showMessageBoxSync(remote.getCurrentWindow(), {
                type: 'warning',
                title: 'Błąd przy kopiowaniu plików karty',
                message: err.name + ': ' + err.message,
              })
            }
        }

        if(!result){
          return false;
        }
        data.card.sound = data.card.id + '.' + extension;
      }
      
      context.commit('addCard', data.card);

      context.dispatch('updateDeck');
      return true;
    },

    deleteCard(context, id){
      let card = context.state.deck.cards.find(c => c.id == id);
      let noError = true;

      if(card.avatar != '' && card.avatar != undefined){
        try{
          fs.unlinkSync(context.state.path + '\\assets\\images\\' + card.avatar)
        }catch(err){
          noError = false;
          dialog.showMessageBoxSync(remote.getCurrentWindow(), {
            type: 'error',
            title: 'Błąd przy próbie usunięcia karty',
            message: 'Nie można usunąć pliku graficznego avataru karty. Powód: ' + '\n' + err.name + ': ' + err.message,
          })
        }
      }

      if(card.sound != '' && card.sound != undefined){
        try{
          fs.unlinkSync(context.state.path + '\\assets\\sounds\\' + card.sound)
        }catch(err){
          noError = false;
          dialog.showMessageBoxSync(remote.getCurrentWindow(), {
            type: 'error',
            title: 'Błąd przy próbie usunięcia karty',
            message: 'Nie można usunąć pliku dźwiękowego karty. Powód: ' + '\n' + err.name + ': ' + err.message,
          })
        }
      }

      if(noError){
        context.commit('removeCard', id);
        context.dispatch('updateDeck');
      }
    },


    updateDeck(context){
      return new Promise(function(resolve,reject){
        try{
          //newDeck = JSON.parse(deck);
          let deck = JSON.stringify(context.state.deck);
          let dir = context.state.path + '/deck.json';
          console.log(dir)
          fs.writeFileSync(dir, deck, 'utf-8');
          resolve(true);
        }catch(e){
          reject(e);
        } 
      })
    },

    getCardData(context, id){
      return context.state.deck.cards.find(card => card.id === id);
    },
    
  },
  
  getters: {

    getCards(context){
      return context.deck.cards;
    },

    getPath(context){
      return context.path;
    },

    getNewId(context){
      return context.deck.idc;
    },

    getHeroes(context){
      return context.deck.heroes;
    }

    

  },


  
  modules: {
  }
})
