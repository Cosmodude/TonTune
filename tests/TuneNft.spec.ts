import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Address } from '@ton/core';
import { TuneNft } from '../wrappers/TuneNft';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { buildCollectionContentCell } from '../scripts/contentUtils/off-chain';

describe('TuneNft', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('TuneNft');
    });

    let blockchain: Blockchain;
    let tuneNft: SandboxContract<TuneNft>;
    let deployer;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        tuneNft = blockchain.openContract(TuneNft.createFromConfig({
            ownerAddress: deployer.address as Address,
            nextItemIndex: 0,
            collectionContent: buildCollectionContentCell(
                {
                    collectionContent: 'https://raw.githubusercontent.com/Cosmodude/TonTune/main/collectionMetadata.json',
                    commonContent: ''
                }
            ),
            nftItemCode: await compile('NftItem'),
            royaltyParams: {
                royaltyFactor: Math.floor(Math.random() * 100),
                royaltyBase: 100,
                royaltyAddress: deployer.address as Address
            }
            
        }, code));

        const deployResult = await tuneNft.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tuneNft.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tuneNft are ready to use
    });
});
