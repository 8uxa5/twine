const path = require('path');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const inquirer = require('inquirer');
const configure = require('../../commands/configure');
const CredentialManager = require('../../lib/credential-manager');
const Twitter = require('../../lib/twitter');
const util = require('../../lib/util');

chai.use(dirtyChai);

describe('the configure module', () => {
	var creds;

	before(() => {
		creds = new CredentialManager('twine-test');
	});

	beforeEach(() => {
		sinon.createSandbox();
	});

	it('should add credentials then none are found', async () => {
		sinon.stub(inquirer, 'prompt').resolves({ key: 'one', secret: 'two' });
		await configure.consumer('twine-test');
		let [
			key,
			secret
		] = await creds.getKeyAndSecret('apiKey');
		expect(key).to.equal('one');
		expect(secret).to.equal('two');
		expect(inquirer.prompt.calledOnce).to.be.true();
	});

	it('should overwrite existing credentials', async () => {
		sinon.stub(inquirer, 'prompt').resolves({ key: 'three', secret: 'four' });
		await configure.consumer('twine-test');
		let [
			key,
			secret
		] = await creds.getKeyAndSecret('apiKey');
		expect(key).to.equal('three');
		expect(secret).to.equal('four');
		expect(inquirer.prompt.calledOnce).to.be.true();
	});

	it('should add an account', async () => {
		sinon.stub(CredentialManager.prototype, 'getKeyAndSecret').resolves([
			'key',
			'secret'
		]);
		sinon
			.stub(Twitter.prototype, 'post')
			.onFirstCall()
			.resolves('oauth_token=abs&oauth_token_secret=def')
			.onSecondCall()
			.resolves('oauth_token=ghi&oauth_token_secret=jkl');
		sinon.stub(Twitter.prototype, 'get').resolves({ screen_name: 'foo' });
		sinon.stub(inquirer, 'prompt').onFirstCall().resolves({ continue: '' }).onSecondCall().resolves({ pin: '1234' });
		sinon.stub(util, 'openBrowser').returns('');
		sinon.spy(console, 'log');
		await configure.account('twine-test');
		CredentialManager.prototype.getKeyAndSecret.restore();
		let [
			token,
			secret
		] = await creds.getKeyAndSecret('accountToken');
		expect(token).to.equal('ghi');
		expect(secret).to.equal('jkl');
		expect(console.log.calledWith('Account "foo" successfully added!')).to.be.true();
	});

	afterEach(() => {
		sinon.restore();
	});

	after((done) => {
		fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done);
	});
});
