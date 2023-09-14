/*
 * @Description: 飞线效果（参考开源代码）
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-05 16:13:21
 * @LastEditors: Julian
 * @LastEditTime: 2022-03-05 17:39:38
 */
import * as Cesium from "cesium";
function LineFlowMaterialProperty (options) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._speed = undefined;
  this._percent = undefined;
  this._gradient = undefined;
  this.color = options.color;
  this.speed = options.speed;
  this.percent = options.percent;
  this.gradient = options.gradient;
}

Object.defineProperties(LineFlowMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  percent: Cesium.createPropertyDescriptor('percent'),
  gradient: Cesium.createPropertyDescriptor('gradient'),
});
LineFlowMaterialProperty.prototype.getType = function (time) {
  return Cesium.Material.LineFlowMaterialType;
};
LineFlowMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
  result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
  result.percent = Cesium.Property.getValueOrDefault(this._percent, time, 0.1, result.percent);
  result.gradient = Cesium.Property.getValueOrDefault(this._gradient, time, 0.01, result.gradient);
  return result
};
LineFlowMaterialProperty.prototype.equals = function (other) {
  return (this === other ||
    (other instanceof LineFlowMaterialProperty &&
      Cesium.Property.equals(this._color, other._color) &&
      Cesium.Property.equals(this._speed, other._speed) &&
      Cesium.Property.equals(this._percent, other._percent) &&
      Cesium.Property.equals(this._gradient, other._gradient))
  )
}

// Cesium.LineFlowMaterialProperty = LineFlowMaterialProperty;
Cesium.Material.LineFlowMaterialProperty = 'LineFlowMaterialProperty';
Cesium.Material.LineFlowMaterialType = 'LineFlowMaterialType';
Cesium.Material.LineFlowMaterialSource =
  `
    uniform vec4 color;
    uniform float speed;
    uniform float percent;
    uniform float gradient;
    
    czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st;
      float t =fract(czm_frameNumber * speed / 1000.0);
      t *= (1.0 + percent);
      float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
      alpha += gradient;
      material.diffuse = color.rgb;
      material.alpha = alpha;
      return material;
    }
    `

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowMaterialType, {
  fabric: {
    type: Cesium.Material.LineFlowMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 100.0,
      percent: 10.1,
      gradient: 0.01
    },
    source: Cesium.Material.LineFlowMaterialSource
  },
  translucent: function(material) {
    return true;
  }
})
export default LineFlowMaterialProperty;