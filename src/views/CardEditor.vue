<template>
  <div class="ce grey lighten-5">
      <div class="card-view">
          <card
            :name="name"
            :avatar="avatar"
            :s1="s1"
            :s2="s2"
            :s3="s3"
            :d1="d1"
            :d2="d2"
            :d3="d3"
            :d4="d4"
            :d5="d5"
            :hero="hero"
          ></card>
          
      </div>
      <div class="inputs">
          <v-label>ID: {{ id }}</v-label>
          <br/>
          <v-label>Nazwa</v-label>
          <v-text-field solo id="i2" v-model="name" :rules="nrules" class="cinput" label="nazwa bohatera" ></v-text-field>
          <br>
          <v-label>Statystyki</v-label>
          <br>
          <label >Zdrowie</label>
          <v-text-field solo v-model="s1" :rules="srules" class="cinput number" label="s1" type="number"></v-text-field>
          <v-text-field solo v-model="s2" :rules="srules" class="cinput number" label="s2" type="number"></v-text-field>
          <v-text-field solo v-model="s3" :rules="srules" class="cinput number" label="s3" type="number"></v-text-field>
          <br>
          <v-label>Opis</v-label>
          <v-text-field solo clearable v-model="d1" :rules="drules" class="cinput" label="opis 1"></v-text-field>
          <v-text-field solo clearable v-model="d2" :rules="drules" class="cinput" label="opis 2"></v-text-field>
          <v-text-field solo clearable v-model="d3" :rules="drules" class="cinput" label="opis 3"></v-text-field>
          <v-text-field solo clearable v-model="d4" :rules="drules" class="cinput" label="opis 4"></v-text-field>
          <v-text-field solo clearable v-model="d5" :rules="drules" class="cinput" label="opis 5"></v-text-field>
          
          <br>
          <v-label>Ustawienia</v-label>
          <br/>

          <v-chip
            v-if="!achoosed"
            class="ma-2"
            color="pink"
            label
            text-color="white"
            @click="chooseAvatar()"
          >
            <v-icon left>mdi-image</v-icon>
            Wybierz avatar
          </v-chip>

          <v-chip
            v-else
            class="ma-2"
            color="green"
            close
            close-icon="mdi-close-circle"
            outlined
            pill
            text-color="black"
            @click:close="avatar = ''"
          >
            <v-icon left>mdi-image</v-icon>
            {{fileName}}
          </v-chip>

          <br/>

          <v-chip
            v-if="!schoosed"
            class="ma-2"
            color="light-green"
            label
            text-color="white"
            @click="chooseSound()"
          >
            <v-icon left>mdi-music-circle</v-icon>
            Wybierz dźwięk karty
          </v-chip>

          <v-chip
            v-else
            class="ma-2"
            color="green"
            close
            close-icon="mdi-close-circle"
            outlined
            pill
            text-color="black"
            @click:close="sound = ''"
          >
            <v-icon left>mdi-music-circle</v-icon>
            {{sFileName}}
          </v-chip>

          <v-switch class="ma-2 sl" v-model="hero" label="karta gracza"></v-switch>
          

          <v-subheader v-if="!hero" class="ma-2">Karta ma być dostępna dla:</v-subheader>
          <v-select
            v-if="!hero"
            v-model="card_deck"
            :items="heroes"
            class="cinput ma-2"
            item-text="name"
            item-value="id"
            label="Wybierz dostępność karty"
            solo
            return-object
            single-line
          ></v-select>
        <div class="save">
          <v-btn large text color="primary" class="btn" @click="discardCard()" >Anuluj</v-btn>
          <v-btn large color="primary" class="btn" @click="saveCard()" :disabled="!validated">Zapisz kartę</v-btn>
        </div>
        
        

        
      </div>
      <v-btn
      icon
      top
      left
      fixed
      @click="discardCard()"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
  </div>
</template>

<script>
import card from '../components/card2e-editor.vue'


export default {
  components:{
    card,
    
  },

  props:{
    idp: {
      default: -1,
    },
  },

  data() {
      return {
        name: '',
        s1: 0,
        s2: 0,
        s3: 0,
        d1: '',
        d2: '',
        d3: '',
        d4: '',
        d5: '',
        avatar: '',
        sound: '',
        id: null,
        heroes: [{"name": 'cały deck', id: -1}],
        card_deck: '',
        hero: false,
        
        
        nrules: [
            value => !!value || 'Nazwa jest wymagana!',
            value => (value || '').length <= 22 || 'Maksymalnie 22 znaki',
        ],

        srules: [
            value => !!value || 'To pole jest wymagane!',
            value => value < 10000 || 'Zbyt duża wartość',
            value => value > -10000 || 'Zbyt mała wartość',
        ],

        drules: [
            value => (value || '').length <= 42 || 'Maksymalnie 42 znaki',
        ],

        arules: [
            value => !value || value.size < 2000000 || 'Avatar powinien ważyć mniej niż 2 MB!',
        ],

        sdrules: [
            value => !value || value.size < 5000000 || 'Dźwięk powinien ważyć mniej niż 5 MB!',
        ]
      }
  },

  methods: {
    back(){
      this.$router.push({ name: 'Deck'});
    },

    setCardData(){
      if(this.idp == -1){
        this.id = this.$store.getters.getNewId + 1;
      }
      else{
        this.id = parseInt(this.idp);
        this.$store.dispatch('getCardData',this.id).then(card =>{
          this.name = card.name;
          
          this.s1 = card.s1;
          this.s2 = card.s2;
          this.s3 = card.s3;
          this.d1 = card.d1;
          this.d2 = card.d2;
          this.d3 = card.d3;
          this.d4 = card.d4;
          this.d5 = card.d5;
          if(card.avatar != '' && card.avatar != undefined){
            this.avatar = String(this.$store.getters.getPath + '\\assets\\images\\' + card.avatar);
          }
          if(card.sound != '' && card.sound != undefined){
            this.sound = String(this.$store.getters.getPath + '\\assets\\sounds\\' + card.sound);
          }
          this.card_deck = {id: -1}
          this.card_deck.id = card.card_deck;
          this.hero = card.hero;
        });
        
      }

    },

    chooseAvatar(){
      this.$store.dispatch('chooseAvatar').then(path => {
        if(path !== undefined && path !== null){
          this.avatar = path;
        }
      })
    },
    
    chooseSound(){
      this.$store.dispatch('chooseSound').then(path => {
        if(path !== undefined && path !== null){
          this.sound = path;
        }
      })
    },

    discardCard(){
      this.name = '';
      this.s1 = 0;
      this.s2 = 0;
      this.s3 = 0;
      this.d1 = '';
      this.d2 = '';
      this.d3 = '';
      this.d4 = '';
      this.d5 = '';
      this.avatar = '';
      this.sound = '';
      this.id = null;
      this.heroes = [{"name": 'cały deck', id: -1}];
      this.card_deck = '';
      this.hero = false;
      this.$router.push({ name: 'Deck'});
    },

    getHeroes(){
      let h = this.$store.getters.getHeroes;
      h.forEach(hero => {
        this.heroes.push(hero);
      });
    },

    saveCard(){
      let sub_deck = -1;
      if(this.card_deck != undefined && this.card_deck != ''){
        sub_deck = this.card_deck.id;
      }
      if(this.hero){
        sub_deck = -1;
      }
      let card = {
        name: this.name,
        s1: this.s1,
        s2: this.s2,
        s3: this.s3,
        d1: this.d1,
        d2: this.d2,
        d3: this.d3,
        d4: this.d4,
        d5: this.d5,
        avatar: '',
        sound: '',
        id: this.id,
        card_deck: sub_deck,
        hero: this.hero,
      }
      console.log(card)
      let data = {
        apath: this.avatar,
        spath:  this.sound,
        card: card,
      }

      this.$store.dispatch('saveCard', data).then(result =>{
        console.log('RRReturned')
        console.log(result)
        if(result){
          this.discardCard()
        }
      })
    }

    
  },

  computed: {
    fileName(){
      return this.avatar.replace(/^.*[\\\\/]/, '')
    },

    sFileName(){
      return this.sound.replace(/^.*[\\\\/]/, '')
    },

    achoosed(){
      return this.avatar != '';
    },

    schoosed(){
      return this.sound != '';
    },

    validated(){
      if(this.name != ''){
        if(this.hero){
          return true;
        }
        else{
          if(this.card_deck != '')
            return true;
          else
            return false
        }
      }
      else
        return false
    }

  },

  mounted() {
    this.setCardData()
    this.getHeroes()
  },
}
</script>


<style >

  .ce{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding: 1rem;
  }
  .card-view{
    flex: 1;
  }


  .inputs{
    flex: 1;
    margin-left: 50px;
  }

  .cinput{
    width: 80%;
    font-weight: 600;
  }


  .number{
    max-width: 6rem;
  }

  .number >>> input{
    text-align: center!important;
  }

  #i2 ::placeholder{
    font-weight: 400 !important;
    color: red !important; 
  }

  .save{
    margin-right: 5px;
  }

</style>