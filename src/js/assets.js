import assets from "./assets.json";

export default class Assets {
  static assetPath(name) {
    return assets[name] || name;
  }
}
