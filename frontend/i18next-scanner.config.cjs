const path = require('path');

module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}"],  // 対象ファイルパス
  output: "src/i18n/locales",  // 翻訳ファイルの出力先
  options: {
    debug: true,
    removeUnusedKeys: false,
    sort: true,
    lngs: ["en", "ja"],  // 言語リスト
    defaultLng: "en",
    defaultValue: (lng, ns, key) => key,  // デフォルト値としてキー名を使用
    resource: {
      loadPath: "{{lng}}.json",
      savePath: "{{lng}}.json",
      jsonIndent: 2,
    },
    keySeparator: ".",  // ドットをキー階層として認識
    nsSeparator: false,  // ネームスペースセパレータを無効化
    func: {
      list: ["t"],  // t() 関数を検出対象に
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      defaultsKey: "defaults",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      fallbackKey: false,
    },
  },
};
