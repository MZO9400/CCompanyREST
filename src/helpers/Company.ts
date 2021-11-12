export const generateRandomPhoneNumber = (): string => {
    return "+923" + generateRandomStringOfNumbers(9)
}

const generateRandomStringOfNumbers = (length: number): string => {
    let number = ""
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 9) + 1
    }
    return number
}
