module.exports = {
    getItem(key) {
        let v = null;
        if (window.wx && window.wx.setStorageSync && window.wx.getStorageSync) {
            v = window.wx.getStorageSync(key);
        } else {
            v = window.localStorage.getItem(key);
        }
        return v;
    },
    setItem(key, str) {
        if (window.wx && window.wx.setStorageSync && window.wx.getStorageSync) {
            window.wx.setStorageSync(key, str);
        } else {
            window.localStorage.setItem(key, str);
        }
    },
    removeItem(key) {
        if (window.wx && window.wx.clearStorageSync) {
            window.wx.clearStorageSync(key);
        } else {
            window.localStorage.removeItem(key);
        }
    },
    clear() {
        if (window.wx && window.wx.clearStorageSync) {
            window.wx.clearStorageSync();
        } else {
            window.localStorage.clear();
        }
    }
};
