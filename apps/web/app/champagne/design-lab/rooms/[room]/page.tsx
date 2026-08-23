import { RegistryBrowser } from "../../_components/RegistryBrowser";

export default async function RoomPage({ params }: { params: Promise<{ room: string }> }) { const { room } = await params; return <main className="dl-main"><p className="dl-kicker">EVIDENCE ROOM</p><h1>{room}</h1>{room === "whole-pages" ? <p>Ordered multi-selection and JSON export are available in Room 11 on the Lab home.</p> : null}<RegistryBrowser room={room} /></main>; }
