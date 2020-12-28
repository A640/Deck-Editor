<template >
    <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
            <v-list-item
               v-on="on"
               v-bind="attrs"     
            >
                <v-list-item-title>Usuń</v-list-item-title>
            </v-list-item>
        </template>
        <v-card>
            <v-card-title>
                <h2 class="mb-2 mt-3">{{ name }}</h2>
                <br/>
            </v-card-title>
            <v-card-subtitle>
                ID: {{ id }}
            </v-card-subtitle>

            <v-card-text>
                <p v-if="name == 'Usuń kartę'" class="mb-1">Czy napewno chcesz usunąć wybraną kartę?</p>
                <p v-else class="mb-1">Czy napewno chcesz usunąć kartę {{ name }}?</p>
                <p v-if="hero">Wszystkie karty dostępne do tej pory dla gracza <b>{{ name }}</b> będą dostępne <b>w całym decku!</b> </p>
                <p v-if="hero">Tych akcji nie można cofnąć!</p>
                <p v-else class="mt-0">Tej akcji nie można cofnąć!</p>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text class="mb-3" @click="dialog = false">Anuluj</v-btn>
                <v-btn 
                 color="red lighten-1" 
                 class="mb-3 mr-2" 
                 dark 
                 @click="removeCard(id)"
                >Usuń</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        name:{
            type: String,
            default: 'Usuń kartę',
        },
        id:{
            type: Number,
            default: undefined,
        },
        hero:{
            type: Boolean,
            default: false,
        }
    },

    data() {
        return {
            dialog: false,
        }
    },

    methods: {
        removeCard(id){
            this.$store.dispatch('deleteCard', id)
        },
    },
    
}
</script>