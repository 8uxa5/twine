const path = require('path');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const dirtyChai = require('dirty-chai');
const CredentialManager = require('../../lib/credential-manager');

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('The credential manager', () => {
	var creds;
	before(() => {
		creds = new CredentialManager('twine-test');
	});
	it('should return credentials then they are found', async () => {
		await creds.storeKeyAndSercret('apiKey', 'foo', 'bar');
		let [
			key,
			secret
		] = await creds.getKeyAndSecret('apiKey');
		expect(key).to.equal('foo');
		expect(secret).to.equal('bar');
	});
	it('should reject when no credentials are found', async () => {
		await creds.clearKeyAndSecret('apiKey');
		expect(creds.getKeyAndSecret('apiKey')).to.be.rejected();
	});
	after((done) => {
		fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done);
	});
});
