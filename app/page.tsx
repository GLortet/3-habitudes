import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/PageHeader";

const steps = ["Je fais mon état actuel", "Je repère mes habitudes coûteuses", "Je choisis 3 changements réalistes", "Je mesure poids, énergie et ressenti pendant 14 jours"];
export default function HomePage() {
  return <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <section>
      <PageHeader eyebrow="Audit Habitudes Minceur" title="Auditez vos habitudes. Changez 3 variables. Mesurez 14 jours." subtitle="Pas de régime extrême. Pas de culpabilité. Juste un audit simple pour comprendre ce qui pèse vraiment dans votre quotidien." />
      <div className="grid gap-3 sm:grid-cols-2"><Button href="/audit?mode=express">Je veux aller vite</Button><Button href="/audit?mode=complet" variant="secondary">Je veux faire le tour complet</Button></div>
      <p className="mt-3 text-sm font-semibold text-slateblue">Audit Express : 3 à 5 minutes. Audit Complet : 10 à 15 minutes.</p>
      <p className="mt-5 rounded-2xl bg-sage-50 p-4 text-sm leading-6 text-slateblue">Cet outil n’est pas un dispositif médical. En cas de pathologie, trouble alimentaire, grossesse, traitement médical ou doute important, demandez l’avis d’un professionnel de santé.</p>
    </section>
    <Card className="grid gap-4">
      <h2 className="text-2xl font-black">La méthode en 4 étapes</h2>
      {steps.map((step, index) => <div key={step} className="flex gap-4 rounded-2xl bg-mist p-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage-700 font-black text-white">{index + 1}</span><p className="font-semibold text-ink">{step}</p></div>)}
      <p className="text-sm font-semibold text-sage-700">On ne cherche pas la perfection. On cherche la variable rentable.</p>
    </Card>
  </div>;
}
