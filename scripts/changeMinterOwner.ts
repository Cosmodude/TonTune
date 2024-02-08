import { Address, toNano } from '@ton/core';
import { JettonMinter, JettonMinterContent, jettonContentToCell, jettonMinterConfigToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider, UIProvider} from '@ton/blueprint';
import { promptAddress, promptBool, promptUrl } from './jettonDeployUtils/utils';

const formatUrl = "https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain";
const exampleContent = {
                          "name": "Sample Jetton",
                          "description": "Sample of Jetton",
                          "symbol": "JTN",
                          "decimals": 0,
                          "image": "https://www.svgrepo.com/download/483336/coin-vector.svg"
                       };
const urlPrompt = 'Minter address:';

export async function run(provider: NetworkProvider) {
    const ui       = provider.ui();
    const sender   = provider.sender();
    const adminPrompt = `Please specify admin address`;
    ui.write(`Jetton deployer\nCurrent deployer onli supports off-chain format:${formatUrl}`);

    let minterAddress = await promptUrl(urlPrompt, ui);
    ui.write(`Jetton minter address: ${minterAddress}`);

    let admin      = await promptAddress(adminPrompt, ui, sender.address);
    ui.write(`New Admin address:${admin}\n`);
    

    const minter  = provider.open(JettonMinter.createFromAddress(Address.parse(minterAddress)));

    await minter.sendChangeAdmin(sender,admin);
}