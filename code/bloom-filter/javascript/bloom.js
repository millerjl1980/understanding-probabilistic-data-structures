const fnv = require('fnv-plus')
const murmur = require('murmurhash')
const jenkins = require('jenkins-hash')

const hashFunctions = [
  s => fnv.fast1a32(s),
  s => murmur.v2(s),
  s => murmur.v3(s),
  s => jenkins.hashlittle(s, 0xbeeff00d)
]

class BloomFilter {

  constructor(size, hashCount = 4) {

    if (hashCount > hashFunctions.length || hashCount < 2)
      throw "You can only have 2, 3, or 4 hashes"
    this.hashes = hashFunctions.slice(0, hashCount)

    this.bits = new Array(size)
    this.bits.fill(false)

  }

  get size() {
    return this.bits.length
  }

  get hashCount() {
    return this.hashes.length
  }

  add(s) {
    this.computeHashes(s)
      .forEach(n => this.bits[n] = true)
  }

  check(s) {
    return this.computeHashes(s)
      .every(n => this.bits[n])
  }

  computeHashes(s) {
    return this.hashes
      .map(fn => fn(s))
      .map(n => n % this.size)
  }

}

exports.BloomFilter = BloomFilter