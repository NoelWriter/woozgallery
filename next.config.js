
module.exports = {
    images: {
        disableStaticImages: true
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(mp4|svg|png|jpe?g|gif)$/,
            type: "asset/resource"
        })

        return config
    },
}