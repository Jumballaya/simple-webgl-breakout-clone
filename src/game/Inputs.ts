export class Inputs {

    private keys: Set<string> = new Set();

    constructor() {
        document.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
        });
        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });
    }

    public isPressed(keys: string[]): boolean {
        return keys.every(k => this.keys.has(k.toLowerCase()));
    };
}
