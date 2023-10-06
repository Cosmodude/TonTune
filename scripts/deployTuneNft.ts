import { toNano } from 'ton-core';
import { TuneNft } from '../wrappers/TuneNft';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const tuneNft = provider.open(TuneNft.createFromConfig({}, await compile('TuneNft')));

    await tuneNft.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tuneNft.address);

    // run methods on `tuneNft`
}
