export default function eratosthenesSieve(n){
    let prime = new Array(n+1).fill(true)

    prime[0] = prime[1] = false

    for (let p = 2; p * p <= n; p++){
        if(prime[p]){

            for (let i = p * p; i <= n; i +=p ){
                prime[i] = false
            }
        }
    }

    let result = []

    for (let i = 2; i <= n; i++){

        if(prime[i]){
            result.push(i)
        }
    }

    return result
}