describe('example test suite', () => {
  it('should demonstrate how to write a test', () => {
    // arrange
    const expectedAnswer = 2;

    // act
    const actualAnswer = Math.sqrt(4);

    // assert
    expect(actualAnswer).toEqual(expectedAnswer);
  })
});
