<template>
    <div>
        <div class="stat-container">
            <img class="stat-bg" src="../assets/stat-bg.png"/>
            <p class="stat-text">12</p>
        </div>
        
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
  .stat-container{
    position: relative;
    display: inline-block;
    width: 5%;
  }

  .stat-bg{
    width: 100%;
  }

  .stat-text{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate( -50%, -50% );
    text-align: center;
    margin: 0;
    font-size: 5em;
    font-weight: bold;
  }

</style>