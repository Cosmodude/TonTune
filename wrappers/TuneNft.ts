import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type TuneNftConfig = {};

export function tuneNftConfigToCell(config: TuneNftConfig): Cell {
    return beginCell().endCell();
}

export class TuneNft implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TuneNft(address);
    }

    static createFromConfig(config: TuneNftConfig, code: Cell, workchain = 0) {
        const data = tuneNftConfigToCell(config);
        const init = { code, data };
        return new TuneNft(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
