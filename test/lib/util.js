const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
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
	context('the handleError function', () => {
		it('should set exitCode to 1', () => {
			sinon.stub(console, 'error');
			util.handleError('foo');
			expect(process.exitCode).to.equal(1);
			console.error.restore();
		});

		it('should print a message to console.error', () => {
			sinon.stub(console, 'error');
			util.handleError('bar');
			expect(console.error.calledWith('bar'));
			console.error.restore();
		});
	});
});
