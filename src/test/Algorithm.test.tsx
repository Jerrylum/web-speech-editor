import { render, screen } from '@testing-library/react';
import { diff_algorithm } from '../Algorithm';

test('empty array returns empty array', () => {
    expect(diff_algorithm([])).toEqual([]);
});

test('array with empty string returns empty array', () => {
    expect(diff_algorithm([''])).toEqual([]);
    expect(diff_algorithm(['', ''])).toEqual([]);
});

test('length 1 array returns okay', () => {
    expect(diff_algorithm(['ABC'])).toEqual([['ABC']]);
    expect(diff_algorithm(['物理力學'])).toEqual([['物理力學']]);
});

// constant diff 

test('array with normal and empty string returns okay', () => {
    expect(diff_algorithm(['A', ''])).toEqual([['A', '']]);
    expect(diff_algorithm(['', 'B'])).toEqual([['', 'B']]);
});

test('array with string in different sizes returns okay', () => {
    expect(diff_algorithm(['AA', 'B'])).toEqual([['AA', 'B']]);
    expect(diff_algorithm(['A', 'BB'])).toEqual([['A', 'BB']]);
});

test('array with constant and diff parts returns okay', () => {
    expect(diff_algorithm(['AC', 'A'])).toEqual([['A'], ['C', '']]);
    expect(diff_algorithm(['A', 'AC'])).toEqual([['A'], ['', 'C']]);
    expect(diff_algorithm(['AC', 'BC'])).toEqual([['A', 'B'], ['C']]);
    expect(diff_algorithm(['AAC', 'BC'])).toEqual([['AA', 'B'], ['C']]);
    expect(diff_algorithm(['AC', 'BBC'])).toEqual([['A', 'BB'], ['C']]);
    expect(diff_algorithm(['ABC', 'AB'])).toEqual([['AB'], ['C', '']]);
    expect(diff_algorithm(['ABC', 'ADC'])).toEqual([['A'], ['B', 'D'], ['C']]);
});

test('array with middle constant returns okay', () => {
    expect(diff_algorithm(['ABC', 'CD'])).toEqual([['AB', ''], ['C', 'CD']]);
    expect(diff_algorithm(['ABC', 'CDE'])).toEqual([['AB', ''], ['C', 'CDE']]);
    expect(diff_algorithm(['ABC', 'CDEF'])).toEqual([['AB', ''], ['C'], ['', 'DEF']]);
    expect(diff_algorithm(['BBCD', 'ABCDE'])).toEqual([['', 'A'], ['B'], ['B', ''], ['CD'], ['', 'E']]);
    
});

test('array with three strings returns okay', () => {
    expect(diff_algorithm(['ABCDE', 'ABCD', 'AB'])).toEqual([['AB'], ['CDE', 'CD', '']]);
});

test('long input returns okay', () => {
    expect(diff_algorithm([
        'abcdeuefhijklmnopqrtsubwxyz',
        'abcdeijklmnopqrstuvwxyz',
        'abcdfghijkmnpqrsuvwxyz',
        'abcdefghijklmnopqrstuvwxyz'])).toEqual([
            ['abcd'],
            ['euefh', 'e', 'fgh', 'efgh'],
            ['ijk'],
            ['l', 'l', '', 'l'],
            ['mn'],
            ['o', 'o', '', 'o'],
            ['pqr'],
            ['t', '', '', ''],
            ['s'],
            ['', 't', '', 't'],
            ['u'],
            ['b', 'v', 'v', 'v'],
            ['wxyz']
        ]);

    expect(diff_algorithm([
        'abcdeuefhijklmnopqrtsubwxyz',
        'abcdeijklmnopqrstuvwxyz',
        'abcdfghijkmnpqrsuvwxy',
        'abcdefghijklmnopqrstuvwxyz'])).toEqual([
            ['abcd'],
            ['euefh', 'e', 'fgh', 'efgh'],
            ['ijk'],
            ['l', 'l', '', 'l'],
            ['mn'],
            ['o', 'o', '', 'o'],
            ['pqr'],
            ['t', '', '', ''],
            ['s'],
            ['', 't', '', 't'],
            ['u'],
            ['b', 'v', 'v', 'v'],
            ['wxy'],
            ['z', 'z', '', 'z']
        ]);

    expect(diff_algorithm([
        'abcdeuefhijklmnopqrtsubwxyz',
        'abcdeijklmnopqrstuvwxz',
        'abcdfghijkmnpqrsuvwxyz',
        'abcdefghijklmnopqrstuvwxyz'])).toEqual([
            ['abcd'],
            ['euefh', 'e', 'fgh', 'efgh'],
            ['ijk'],
            ['l', 'l', '', 'l'],
            ['mn'],
            ['o', 'o', '', 'o'],
            ['pqr'],
            ['t', '', '', ''],
            ['s'],
            ['', 't', '', 't'],
            ['u'],
            ['b', 'v', 'v', 'v'],
            ['wx'],
            ['y', '', 'y', 'y'],
            ['z']
        ]);
});

test('array with split no english returns okay', () => {
    expect(diff_algorithm(['生物與mmyif環境eer', '生物meigd環境ree'], true)).toEqual([
        ['生物'], 
        ['與', ''],
        ['m'],
        ['my', 'e'],
        ['i'],
        ['f', 'gd'],
        ['環境'],
        ['', 'r'],
        ['ee'],
        ['r', '']
    ]);
    expect(diff_algorithm(['生物與mmyif環境eer', '生物與mmyif環境eer'], true)).toEqual([
        ['生物與mmyif環境eer']
    ]);
    expect(diff_algorithm(['生物與mmyif環境eer和', '生物meigd環境ree和和'], false)).toEqual([
        ['生物'],
        ['與mmyif', 'meigd'],
        ['環境'],
        ['eer', 'ree'],
        ['和', '和和']
    ]);
    expect(diff_algorithm(['生物與mmyif環境eer和', '生物與mmyif環境ree和和'], false)).toEqual([
        ['生物與'],
        ['mmyif', 'mmyif'], // XXX: should be ['mmyif']
        ['環境'],
        ['eer', 'ree'],
        ['和'],
        ['', '和']
    ]);
    expect(diff_algorithm(['生物與mmyif eer和', '生物與mmyif ree和和'], false)).toEqual([
        ['生物與'],
        ['mmyif', 'mmyif'], // XXX: should be ['mmyif']
        [' '],
        ['eer', 'ree'],
        ['和'],
        ['', '和']
    ]);
    expect(diff_algorithm(['生物與mmyif eer和', '生物與meigd環境ree和和'], false)).toEqual([
        ['生物與'],
        ['mmyif eer', 'meigd環境ree'],
        ['和'],
        ['', '和']
    ]);
});