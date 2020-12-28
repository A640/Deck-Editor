<template>
    <div>
        <v-dialog v-model="cropper" width="80%" height="70%">
        <template v-slot:activator="{ on, attrs }">
            <div
               v-on="on" 
               v-bind="attrs"
               class="crop-div"     
            >
                <v-icon>mdi-cropp</v-icon>
            </div>
        </template>
        <v-card class="cropper-dialog">
            <cropper
                ref="cropper"
                class="cropper"
                :src="avatar"
                :stencil-props="{
                    aspectRatio: 23/24
                }"
                :mouseMove=false
                
            ></cropper>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text class="mb-3" @click="cropper = false">Anuluj</v-btn>
                <v-btn 
                 color="red lighten-1" 
                 class="mb-3 mr-2" 
                 dark 
                 @click="crop"
                >Przytnij</v-btn>
            </v-card-actions>
            <img :src="image"/>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'

export default {
    components: {
        Cropper,
    },

    data() {
        return {
            cropper: false,
            image: null,
        }
    },

    props: {
        avatar: {
            type: String,
        },
    },

    methods: {
        crop() {
            const { canvas } = this.$refs.cropper.getResult();
            this.image = canvas.toDataURL("image/gif");
        }
    },

}
</script>

<style scoped>

    .crop-div{
        background: rgba(0,0,0,0);
        width: 100%;
        height: 100%;
        
    }

    .crop-div:hover{
        background: rgba(0,0,0,0.8);
    }

    .cropper{
        width: 80%;
        height: 0%;
        margin: 0 auto;
    }
    

</style>