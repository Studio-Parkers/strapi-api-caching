import pluginPkg from "../../package.json";
export default pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, "");