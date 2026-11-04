# Landmarks missing from the card database

Found while writing the area guides' "Famous landmarks" sections
(`client/src/utils/areaGuides/`). A place goes here when it is well known for
its quarter but has no Location card yet. Tell the user about new entries at
the end of each batch; strike an entry through (or delete it) once its card
exists, and then add its slug to `AREA_LANDMARKS` in
`utils/areaGuides/index.js` if it belongs in the list.

Coordinates are always supplied by the user.

| Place | Quarter | Why it matters | Found |
| --- | --- | --- | --- |
| Nerudova street (Nerudova ulice) | Malá Strana | The main street up to the castle, lined with the house signs the guide talks about (U Tří housliček, U Zlatého klíče, U Červeného orla) | 2026-11-04 |
| Prague Castle as a whole (Pražský hrad) | Hradčany | The whole complex; the slug `prague-castle` is free (see CLAUDE.md), and the guide's list can only name its parts | 2026-11-04 |
| Kafka's birthplace (U Věže, náměstí Franze Kafky) | Staré Město | Mentioned in the Old Town and Josefov guides; only a bust and a plaque, so a small card at most | 2026-11-04 |
| Devil's Column (Čertův sloup) | Vyšehrad | Its legend is in the Vyšehrad guide; three broken stone pieces by the basilica | 2026-11-04 |
| Slavín | Vyšehrad | The shared tomb of the nation's great in the middle of the cemetery; may belong inside the cemetery card instead | 2026-11-04 |
| Vinohrady water tower (Vinohradská vodárna) | Vinohrady | The 1882 neo-Renaissance water tower on Korunní, a landmark of the district | 2026-11-04 |
| Viktoria Žižkov stadium | Žižkov | The home of the club that won the league in 1928, mentioned in the Prague 3 guide | 2026-11-04 |
| Kinsky Garden (Kinského zahrada) | Smíchov | The landscaped park on the Petřín slope around the Kinsky summer palace (which has a card), with the wooden church of St Michael | 2026-11-04 |
| Libeň Synagogue (Libeňská synagoga, Palmovka) | Libeň | Mentioned in the Libeň guide; 19th-century synagogue now used for exhibitions and performances | 2026-11-04 |
| Libeň port (Libeňský přístav) | Libeň | The 19th-century river port behind Libeň's industrial growth; partly a redevelopment site now | 2026-11-04 |
| Břevnov monastery brewery | Břevnov | Claims the oldest brewing records in the country; may fit inside the monastery card instead | 2026-11-04 |
| Ďolíček (Bohemians stadium) | Vršovice | Bohemians' ground for almost a century, named in the Vršovice guide; Slavia's Fortuna Arena already has a card | 2026-11-04 |
