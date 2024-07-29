import fsp from 'fs/promises'

import makeTree, { Tree } from '@termsurf/tree'
import { KinkList } from '@termsurf/kink'

import { CardForm, TakeCardForm } from './form'

export class Card implements CardForm {
  link: string

  // text of the code
  text: string

  // TreeCode representation
  tree: Tree

  constructor({ link, text, tree }: TakeCardForm) {
    this.link = link
    this.text = text
    this.tree = tree
  }
}

export async function loadFile({ file }: { file: string }) {
  const text = await fsp.readFile(file, 'utf-8')
  const lead = makeTree({ file, text })

  if (lead instanceof KinkList) {
    throw lead
  }

  return new Card({ file, text, tree: lead.tree })
}
