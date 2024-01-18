
//% block="i2c EEPROM" color="#355b6d" icon="\uf0ea" groups=["Registers", "Memory"]
namespace i2c_eeprom {

    //% block="write $value into register $register on device $address"
    //% group="Registers"
    export function writeRegister(address: number, register: number, value: number) {
        pins.i2cWriteBuffer(address, Buffer.fromArray([register, value]), false)
    }

    //% block="read register $register on address $address"
    //% group="Registers"
    export function readRegister(address: number, register: number) {
        pins.i2cWriteNumber(address, register, NumberFormat.UInt8BE, false)
        return pins.i2cReadNumber(address, NumberFormat.UInt8BE, false)
    }

    //% block="read from offset $address on address $device"
    //% group="Memory"
    export function readEEPROM(device: number, address: number): number {
        pins.i2cWriteNumber(device, address, NumberFormat.UInt8BE, true)
        return pins.i2cReadNumber(device, NumberFormat.UInt8BE, false)
    }

    //% block="write $value into offset $address on address $device"
    //% group="Memory"
    export function writeEEPROM(device: number, address: number, value: number) {
        pins.i2cWriteBuffer(device, Buffer.fromArray([address, value]), false)
        basic.pause(1)
    }

    //% block="write $data as a string at offset $address on address $device"
    //% group="Memory"
    export function makecodeWriteEEPROMString(device: number, address: number, data: string) {
        writeEEPROMString(device, address, data)
    }

    export function writeEEPROMString(device:number, address: number, data: string): number {
        for (let i = 0; i < data.length; i++)
            writeEEPROM(device, address + i, data.charCodeAt(i))
        writeEEPROM(device, address + data.length, 0)
        return data.length + 1;
    }

    //% block="read as a string from offset $address on address $device"
    //% group="Memory"
    export function readEEPROMString(device: number, address: number): string {
        let buffer = "";
        let offset = address;
        while (address < 1024) {
            let v = readEEPROM(device, address++)
            if (v == 0)
                break
            buffer += String.fromCharCode(v)
        }

        return buffer;
    }

}