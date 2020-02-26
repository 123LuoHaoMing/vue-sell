<template>
  <div class="split border-1px"></div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
@import "../../common/css/style.scss";
@import "../../common/css/minimun.scss";

.split {
  width: 100%;
  height: 16px;
  background-color: $food_bgc_grey;
  @include border_bottom_color($border_color);
  @include border_top_color($border_color);
}
</style>