const generate_timelist = (delemeter = 1, def = {
    disabled: false
}, sec = false, midnight = false) => {
    const array = Array(24).fill(0),
        steps = 60 / delemeter,
        border = 60 - steps
    const res = []
    for (let i = 0; i < array.length; i++) {
        let min = 0;
        for (let j = 0; j < delemeter + 1; j++) {
            if (min <= border) {
                const val = (i < 10 ? '0' + i : i) + ':' + (min < 10 ? '0' + min : min) + (sec ? ':00' : '')
                const
                    obj = {
                        value: val,
                        text: val
                    }
                res.push({...obj, ...def})
                min += steps
            }
        }
    }
    if (midnight) {
        let item = {
            value: '23:59:59',
            text: 'Полночь'
        }
        item = {...item, ...def}
        res.splice(0, 1, item)
    }
    return res
}

const uniqueByKey = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

export {generate_timelist, uniqueByKey}
