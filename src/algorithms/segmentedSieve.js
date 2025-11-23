export default function segmentedSieve(n){

    const limit = Math.floor(Math.sqrt(n))
    const primes = simpleSieve(limit)
    const result = [...primes]

    const lowLimit = limit
    const hightLimit = n


    let low = limit + 1
    let high = 2 * limit

    while (low < n){
        if(high >= n){
            high = n
        }

        const mark = new Array(high - low + 1).fill(true)

        for (let i = 0; i < primes.length; i++) {
            let loLim = Math.floor(low / primes[i]) * primes[i]
            
            if (loLim < low){
                loLim += primes[i]
            }

            
            for (let j = loLim; j <= high; j += primes[i]){
                mark[j - low] = false
            }
        }

        for (let i = low; i <= high; i++) {
            if (mark[i - low] === true) {
                result.push(i)
            }
        }

        low = low + limit
        high = high + limit
    }

    return result
}


function simpleSieve(limit) {
    const mark = new Array(limit + 1).fill(true)
    mark[0] = mark[1] = false

    for (let p = 2; p * p <= limit; p++) {
        if (mark[p] === true) {
            for (let i = p * p; i <= limit; i += p) {
                mark[i] = false
            }
        }
    }

    const primes = []
    for (let p = 2; p <= limit; p++) {
        if (mark[p]) {
            primes.push(p)
        }
    }
    return primes
}

segmentedSieve(49)