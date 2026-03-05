import { describe, it, expect } from 'vitest'
import { parseManifest, writeManifest } from '../code/manifest'

describe('parseManifest', () => {
  it('parses a basic manifest', () => {
    const text = `
deck @cluesurf/my-app
  mark <1.0.0>
  head <My cool app>
  face <Lance Pollard>
  lock apache-2
  sort tool
  link @cluesurf/seed, mark <1.x.x>
  link @cluesurf/tree, mark <2.1.0>
`
    const manifest = parseManifest({ text })

    expect(manifest.host).toBe('cluesurf')
    expect(manifest.name).toBe('my-app')
    expect(manifest.mark).toEqual({ major: 1, minor: 0, patch: 0 })
    expect(manifest.head).toBe('My cool app')
    expect(manifest.lock).toBe('apache-2')
    expect(manifest.sort).toBe('tool')
    expect(manifest.face).toEqual([{ name: 'Lance Pollard' }])
    expect(manifest.link).toHaveLength(2)
    expect(manifest.link[0]!.name).toBe('@cluesurf/seed')
    expect(manifest.link[0]!.mark).toEqual({
      form: 'wild',
      major: 1,
    })
    expect(manifest.link[1]!.name).toBe('@cluesurf/tree')
    expect(manifest.link[1]!.mark).toEqual({
      form: 'exact',
      mark: { major: 2, minor: 1, patch: 0 },
    })
  })

  it('parses peer dependencies', () => {
    const text = `
deck @cluesurf/plugin
  mark <0.1.0>
  link @cluesurf/core, mark <1.x.x>, have 1
`
    const manifest = parseManifest({ text })
    expect(manifest.link[0]!.have).toBe(1)
  })

  it('parses hooks', () => {
    const text = `
deck @cluesurf/tool
  mark <1.0.0>
  hook build, task ./task/build
`
    const manifest = parseManifest({ text })
    expect(manifest.hook).toEqual({ build: './task/build' })
  })
})

describe('writeManifest', () => {
  it('round-trips a manifest', () => {
    const text = `
deck @cluesurf/my-app
  mark <1.0.0>
  head <My cool app>
  link @cluesurf/seed, mark <1.x.x>
`
    const manifest = parseManifest({ text })
    const output = writeManifest({ manifest })

    expect(output).toContain('deck @cluesurf/my-app')
    expect(output).toContain('mark <1.0.0>')
    expect(output).toContain('head <My cool app>')
    expect(output).toContain('link @cluesurf/seed, mark <1.x.x>')
  })
})
