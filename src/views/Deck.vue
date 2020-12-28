<template>
  <div class="deck">
    
      <v-container fluid class="container grey lighten-5">
      <v-row>
        <v-col cols="12">
          <v-row
            align="center"
            justify="center"
            class="grey lighten-5"
            
          >
            <v-card
              v-for="card in Cards"
              :key="card.id"
              class="ma-3 pa-6"
              outlined
              tile
            >
              <card
                :name="card.name"
                :avatar="avatarPath(card.avatar)"
                :s1="card.s1"
                :s2="card.s2"
                :s3="card.s3"
                :d1="card.d1"
                :d2="card.d2"
                :d3="card.d3"
                :d4="card.d4"
                :d5="card.d5"
                :hero="card.hero"
              ></card>
              <v-card-actions>
                <v-menu
                  transition="slide-y-transition"
                  bottom
                  class="card__menu-dots mt-3"
                  
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      icon
                      large
                      right
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="editCard(card.id)"
                    >
                      <v-list-item-title>Edytuj</v-list-item-title>
                    </v-list-item>
                    <deletepop 
                      :id="card.id"
                      :name="card.name"
                      :hero="card.hero"
                    >
                    </deletepop>
                  </v-list>
                </v-menu>
                
                <v-spacer></v-spacer>

                <v-chip
                v-if="card.card_deck != -1"
                color="#edc13a"
                outlined
                class="mt-3 font-weight-medium"
                >{{ subDeck(card.card_deck) }}</v-chip>
              </v-card-actions>              
            </v-card>
            
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-btn
      fab
      color="green accent-2"
      bottom
      right
      fixed
      @click="newCard()"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-btn
      icon
      top
      left
      fixed
      @click="back"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
  </div>
</template>

<script>
import card from '../components/card2e.vue'
import deletepop from '../components/popup.vue'

export default {
  components:{
    card,
    deletepop,
  },

  data(){
    return{
      delete: '',
  }},

  methods: {
    avatarPath(avatar){
      if(avatar != '' && avatar != undefined){
        return String(this.$store.getters.getPath + '\\assets\\images\\' + avatar);
      }
      else{
        return '';
      }
    },
      

    back(){
      this.$router.push({ name: 'Home'});
    },

    newCard(){
      this.$router.push({ name: 'CardEditor', params: { idp: -1 }});
    },

    editCard(cid){
      this.$router.push({ name: 'CardEditor', params: { idp: cid }});
    },

    

    // removeCard(id){
    //   this.$store.commit('removeCard', id)
    // },

   subDeck(id){
      console.log(id)
      if(id == -1){
        return 'whole deck'
      }
      else{
        let heroes = this.$store.getters.getHeroes;
        console.log(heroes)
        let hero = heroes.find(card => card.id === id)
        console.log(hero)
        return hero.name
      }
    },

  },

  computed: {
    Cards(){
      return this.$store.getters.getCards
    },

    
  },
}
</script>


<style module>

  .deck{
    width: 100vw;
    height: 100vh;
  }

  .container{
    width: 100%;
    height: 100%;
  }

  .card{
    height: 10%;
  }

  .card__menu-dots{
    margin-right: 5%;
    margin-left: auto;
  }
</style>