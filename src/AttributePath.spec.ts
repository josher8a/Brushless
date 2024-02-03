import {Attribute,} from './index';

describe('AttributePath', () => {
    it('should convert a string path to a list of elements', () => {
        expect(
            Attribute.pathFromStringUnsafe('foo.bar.baz[3][4][2].fizz[0].buzz[1]')
        ).toMatchObject({
            TAG: 'AttributePath',
            _0: { TAG: 'name', _0: 'foo' },
            _1: [
              { TAG: 'name', _0: 'bar' },
              { TAG: 'name', _0: 'baz' },
              { TAG: 'ListIndex', _0: 3 },
              { TAG: 'ListIndex', _0: 4 },
              { TAG: 'ListIndex', _0: 2 },
              { TAG: 'name', _0: 'fizz' },
              { TAG: 'ListIndex', _0: 0 },
              { TAG: 'name', _0: 'buzz' },
              { TAG: 'ListIndex', _0: 1 }
            ]
          });
    });


    describe('path correctness checking', () => {
        it(
            'should throw an error when a path begins with a control character',
            () => {
                expect(Attribute.pathFromString('[1]'))
                    .toMatchObject({
                        TAG: 'Error',
                        _0: 'InvalidPath'
                    })
            }
        );

        it(
            'should throw an error when a list index access contains invalid characters',
            () => {
                expect(Attribute.pathFromString('foo[a]'))
                    .toMatchObject({
                        TAG: 'Error',
                        _0: {
                            "TAG": "InvalidIndex",
                            "_0": "a",
                        }
                    })
            }
        );

        it(
            'should throw an error when a list index access contains no characters',
            () => {
                expect(Attribute.pathFromString('foo[]'))
                    .toMatchObject({
                        TAG: 'Error',
                        _0: {
                            "TAG": "InvalidIndex",
                            "_0": "",
                        }
                    })
            }
        );

        it(
            'should throw an error when an identifier immediately follows a list index access',
            () => {
                expect(Attribute.pathFromString('foo[1]a'))
                .toMatchObject({
                    TAG: 'Error',
                    _0: 'InvalidPath'
                })
            }
        );
    });

});
