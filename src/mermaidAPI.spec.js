/* eslint-env jasmine */
import mermaidAPI from './mermaidAPI';
import { assignWithDepth } from './utils';

describe('when using mermaidAPI and ', function() {
  describe('doing initialize ', function() {
    beforeEach(function() {
      document.body.innerHTML = '';
      mermaidAPI.reset();
    });

    it('should copy a literal into the configuration', function() {
      const orgConfig = mermaidAPI.getConfig();
      expect(orgConfig.testLiteral).toBe(undefined);

      mermaidAPI.initialize({ testLiteral: true });
      const config = mermaidAPI.getConfig();

      expect(config.testLiteral).toBe(true);
    });
    it('should copy a an object into the configuration', function() {
      const orgConfig = mermaidAPI.getConfig();
      expect(orgConfig.testObject).toBe(undefined);

      const object = {
        test1: 1,
        test2: false
      };

      mermaidAPI.initialize({ testObject: object });
      let config = mermaidAPI.getConfig();

      console.log('1:', config);
      expect(config.testObject.test1).toBe(1);
      mermaidAPI.initialize({ testObject: { test3: true } });
      config = mermaidAPI.getConfig();
      console.log(config);

      expect(config.testObject.test1).toBe(1);
      expect(config.testObject.test2).toBe(false);
      expect(config.testObject.test3).toBe(true);
    });
    it('should reset mermaid config to global defaults', function() {
      let config = {
        logLevel: 0
      };
      mermaidAPI.initialize(config);
      expect(mermaidAPI.getConfig().logLevel).toBe(0);
      mermaidAPI.reset();
      expect(mermaidAPI.getConfig()).toEqual(mermaidAPI.defaultConfig);
    });
    it('should prevent clobbering global defaults (direct)', function() {
      let config = assignWithDepth({}, mermaidAPI.defaultConfig);
      assignWithDepth(config, { logLevel: 0 });

      let error = { message: '' };
      try {
        mermaidAPI['defaultConfig'] = config;
      } catch(e) {
        error = e;
      }
      expect(error.message).toBe('Cannot assign to read only property \'defaultConfig\' of object \'#<Object>\'');
      expect(mermaidAPI.defaultConfig['logLevel']).toBe(5);
    });
    it('should prevent changes to global defaults (direct)', function() {
      let error = { message: '' };
      try {
        mermaidAPI.defaultConfig.logLevel = 0;
      } catch(e) {
        error = e;
      }
      expect(error.message).toBe('Cannot assign to read only property \'logLevel\' of object \'#<Object>\'');
      expect(mermaidAPI.defaultConfig['logLevel']).toBe(5);
    });
    it('should prevent sneaky changes to global defaults (assignWithDepth)', function() {
      let config = {
        logLevel: 0
      };
      let error = { message: '' };
      try {
        assignWithDepth(mermaidAPI.defaultConfig, config);
      } catch(e) {
        error = e;
      }
      expect(error.message).toBe('Cannot assign to read only property \'logLevel\' of object \'#<Object>\'');
      expect(mermaidAPI.defaultConfig['logLevel']).toBe(5);
    });

  });
  describe('checking validity of input ', function() {
    it('it should throw for an invalid definiton', function() {
      expect(() => mermaidAPI.parse('this is not a mermaid diagram definition')).toThrow();
    });
    it('it should not throw for a valid definiton', function() {
      expect(() => mermaidAPI.parse('graph TD;A--x|text including URL space|B;')).not.toThrow();
    });
  });
});
