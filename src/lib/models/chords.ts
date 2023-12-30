const NOTES_SUS: { [key: number]: string } = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
}

const NOTES_BE: { [key: number]: string } = {
  0: 'C',
  1: 'Dь',
  2: 'D',
  3: 'Eь',
  4: 'E',
  5: 'F',
  6: 'Gь',
  7: 'G',
  8: 'Aь',
  9: 'A',
  10: 'Bь',
  11: 'B',
}

type DisplayType = 'Sus' | 'Be'
type TriadType = 'Major' | 'Minor' | 'Augmented' | 'Diminished'
type TriadCipher = '' | 'm' | '5+' | 'ь5'

const TRIAD_CIPHERS = {
  'Major': '',
  'Minor': 'm',
  'Augmented': '5+',
  'Diminished': 'ь5'

}

const TETRAD_CIPHERS: { [interval: number]: string } = {
  5: 'sus4',             // Perfect Fourth
  6: 'ь5',          // Tritone
  //7: 'fifth',            // Perfect Fifth
  8: 'm6',      // Minor Sixth
  9: '6',            // Major Sixth
  10: '7', // Minor Seventh
  11: '7M',    // Major Seventh
  // 12: 'octave',           // Octave
  13: 'ь9',      // Minor Ninth
  14: '9',      // Major Ninth
  15: 'ь10',      // Minor Tenth
  16: '10',      // Major Tenth
  17: '11', // Perfect Eleventh
  18: '11+', // Augmented Eleventh / Tritone
  //19: 'twel',  // Perfect Twelfth / Fifth
  20: 'ь13', // Minor Thirteenth
  21: '13'  // Major Thirteenth
};

interface CipherMounter {
  append: string[] 
  prepend: string[] 
}

function getTriadCipher(triadList: [number, number, number]): CipherMounter {
    const [first, second, third] = triadList.map(note => note % 12);

    // Major triad: 0, 4, 7
    if (second - first === 4 && third - second === 3) {
        return {
        append: [],
        prepend: []
      }
    }
    // Minor triad: 0, 3, 7
    else if (second - first === 3 && third - second === 4) {
        return {
        append: [],
        prepend: [TRIAD_CIPHERS['Minor'] as TriadCipher],
      }
    }
    // Major Diminished fith
    else if (second - first === 4 && third - second === 2) {
        return {
        append: [TRIAD_CIPHERS['Diminished'] as TriadCipher],
        prepend: [],
      }
    }
    // Diminished triad: 0, 3, 6
    else if (second - first === 3 && third - second === 3) {
        return {
        append: [TRIAD_CIPHERS['Diminished'] as TriadCipher],
        prepend: [TRIAD_CIPHERS['Minor'] as TriadCipher],
      }
    }
    // Augmented triad: 0, 4, 8
    else if (second - first === 4 && third - second === 4) {
        return {
        append: [TRIAD_CIPHERS['Augmented'] as TriadCipher],
        prepend: [],
      }
    }

    throw new Error("Invalid triad");
}

export class Chord {
  tonic: number;
  triad: [number, number, number];
  tetrad: number | undefined;
  display: undefined | DisplayType

  constructor(tonic: number, triad: [number, number, number], tetrad?: number) {
    this.tonic = tonic;

    triad = triad.map(note => note % 12) as [number, number, number]
    this.triad = triad;

    tetrad = tetrad ? tetrad % 12 : undefined
    this.tetrad = tetrad;
  }

  getTonicString(): string {
    return NOTES_SUS[this.tonic]
  }

  getCipher(): string {
    let ret = this.getTonicString()
    const triadMount = getTriadCipher(this.triad);
    triadMount.append.forEach(cipher => ret = ret + cipher)
    triadMount.prepend.forEach(cipher => ret = cipher + ret)
    const tetradString = this.tetrad !== undefined ? TETRAD_CIPHERS[this.tetrad] : '';
    const tonicString = this.getTonicString()
    return tonicString + triadString + tetradString
  }
}

// Example of using the Chord class
export const myChord1 = new Chord(0, [0, 4, 7], 11);
export const myChord2 = new Chord(3, [0, 3, 6], 10);
