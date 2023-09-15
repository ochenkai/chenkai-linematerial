<script setup>
  import { ref, onMounted } from 'vue'
  import * as Cesium from 'cesium' // 引入cesium
  import { LineFlickerMaterial, Spriteline1Material, GradientHilightMaterial } from "chenkai-linematerial"

  const viewer = ref(null)
  // 虚拟数据dataSource展示实体，添加材质显示
  const qingDaoDataSource = ref(null)
  onMounted(() => {
    initViewer()  // 初始化视图
    loadData() // 加载虚拟数据 /public/qingdaoRoad.geojson
  })
  
  // 初始化视图
  const initViewer = () => {
    // 初始化viewer
    viewer.value = new Cesium.Viewer('cesiumContainer', {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      animation: false,
      baseLayerPicker: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      timeline: false,
      sceneModePicker: false,
      infoBox: false,
      navigationHelpButton: false
    });
    // 添加天地图图层
    const provider1 = new Cesium.WebMapTileServiceImageryProvider({
      url:'http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&tk=12992cc6c0b014e6a801293a25914d52&request=GetTile&version=1.0.0&layer=cia',
      layer: 'cia',
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      transparent: 'true'
    });
    const layer1 = new Cesium.ImageryLayer(provider1);
    viewer.value.imageryLayers.add(layer1);
  }
  
  // 加载虚拟数据
  const loadData = () => {
    Cesium.GeoJsonDataSource.load("/qingdaoRoad.geojson").then(function(dataSource) {
      viewer.value.dataSources.add(dataSource);
      qingDaoDataSource.value = dataSource
    });
    
    setTimeout(() => {
      // 定位到 数据位置
      viewer.value.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(120.34310099384454, 35.8083920730558326, 80000.0),
        orientation : {
          heading : Cesium.Math.toRadians(0.0),
          pitch : Cesium.Math.toRadians(-60.0),
          roll : 0.0
        }
      });
    }, 11000)
    setTimeout(() => {
      setupFlickerMaterial()
    }, 1000)
    setTimeout(() => {
      setupGradientHilightMaterial()
    }, 10000)
    setTimeout(() => {
      setupSpriteline1Material()
    }, 30000)
  }
  
  // 闪烁线条
  const setupFlickerMaterial = () => {
    const entities = qingDaoDataSource.value.entities.values;
    entities.forEach(entity => {
      entity.polyline.width = 1.5;
      // 设置材质
      entity.polyline.material = new LineFlickerMaterial({
        color: Cesium.Color.YELLOW, // 闪烁高亮时的颜色
        // 设置随机变化速度
        speed: 20 * Math.random(),
      })
    })
  }
  
  // 图片纹理线条
  const setupSpriteline1Material = () => {
    const entities = qingDaoDataSource.value.entities.values;
    entities.forEach(entity => {
      entity.polyline.width = 2;
      // 设置材质
      entity.polyline.material = new Spriteline1Material({
        duration: 1000,
        image: '/gradientline.png'
      });
    })
  }
  
  // 渐变颜色线条
  const setupGradientHilightMaterial = () => {
    const entities = qingDaoDataSource.value.entities.values;
    entities.forEach(entity => {
      entity.polyline.width = 1;
      // 设置材质
      entity.polyline.material = new GradientHilightMaterial({
        color: new Cesium.Color(0.2, 1.0, 0.4, 0.8),
        speed: 15 * Math.random(),
        percent: 0.25,
        gradient: 0.01
      })
    })
  }
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>
  #cesiumContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
