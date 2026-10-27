import { Palette } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { TokenSheet } from './styleguide-tokens'
import { TypeSheet } from './styleguide-type'
import { BadgesSheet, ButtonsSheet, DataSheet, PillsSheet } from './styleguide-parts'
import { FeedbackSheet } from './styleguide-feedback'
import { FieldsSheet, NavSheet, OverlaySheet } from './styleguide-overlays'

export default function StyleGuide() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        icon={Palette}
        title="Design system"
        subtitle="The Tokens block as implemented, plus every component in its variants. Nothing here is decorative: all of it ships in the twelve screens."
      />

      <TokenSheet />
      <TypeSheet />

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-ink">Components</h2>
          <span className="text-[11px] text-muted">10 named by the brief · 8 introduced here</span>
        </div>
        <ButtonsSheet />
        <BadgesSheet />
        <PillsSheet />
        <DataSheet />
        <NavSheet />
        <FieldsSheet />
        <FeedbackSheet />
        <OverlaySheet />
      </section>
    </div>
  )
}
