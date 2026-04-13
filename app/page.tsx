import GameEngine from "@/components/GameEngine";
import hipercalemiaCase from "@/cases/hipercalemia";

export default function Home() {
  return <GameEngine caseData={hipercalemiaCase} />;
}
