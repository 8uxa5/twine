const chai = require('chai');
const expect = chai.expect;
const dirtyChai = require('dirty-chai');
const util = require('../../lib/util');

chai.use(dirtyChai);

describe('the util module', () => {
	context('the not empty function', () => {
		it('should return true when given string', () => {
			expect(util.notEmpty('foo')).to.be.true();
		});
		it('should return an error when given empty string', () => {
			expect(util.notEmpty('')).to.equal('This value is required');
		});
	});
});
