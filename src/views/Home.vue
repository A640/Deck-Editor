<template >
  <div class="home">
    
    <img alt="Logo" id="Logo" src="../assets/projekt-karty.png">
    <v-btn large color="primary" class="btn" @click="dialog = true">Stwórz nowy deck</v-btn>
    <v-btn large outlined color="primary" class="btn" @click="chooseLocation()" >Wczytaj deck</v-btn>

    <v-dialog v-model="dialog" persistent max-width="60%" >
       <v-card>
          <v-card-title class="headline">Po pierwsze nadaj mu nazwę!</v-card-title>
          <v-card-text>
            <v-text-field v-model="iname" :rules="rules" class="input"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer class="spc"></v-spacer>
             <v-btn  text  @click="dialog = false">Anuluj</v-btn>
            <v-btn color="green lighten-1" depressed style="color: white;" @click="createNewDeck()">Wybierz lokalizację</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Home',
  components: {
    
  },

  data () {
    return {
      dialog: false,
      iname: '',

      rules: [
      value => !!value || 'Nazwa jest wymagana!',
      value => (value || '').length <= 64 || 'Maksymalnie 64 znaki',
      ]
    }
  },

  methods: {
    chooseLocation(){
      this.$store.dispatch('loadLocation').then(result =>{
        if(result){
          this.$router.push({ name: 'Deck'});
        }
      });
    },

    createNewDeck(){
      this.dialog = false;
      this.$store.dispatch('newDeck', this.iname).then(result =>{
        if(result){
          this.$router.push({ name: 'Deck'});
        }
      })
    },

  },
  

}
</script>

<style>
  #Logo{
    width: 10rem;
    height: 10rem;
    margin-top: 10%;
    margin-bottom: 3rem;
  }
  
  .home{
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
  }

  .btn{
      width: 30%;
      margin-top: 1rem;
  }

  .input{
    width: 80%;
    margin: 0 auto;
  }

  

</style>