import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { locationAPI, checkinAPI } from "../../services/api";
import { useLang, useT, useConvert } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import {
  getArt,
  LABEL_DEFINITIONS,
  LABEL_COLORS,
} from "../../utils/pixelArtMap";
import { getLocName } from "../../utils/locName";
import { getCurrentPosition, haversineDistance, formatDistance } from "../../utils/geolocation";
import { useUserPosition } from "../../hooks/useUserPosition";
import LanguageSwitcher from "../shared/LanguageSwitcher";
import EditLocationForm from "./EditLocationForm";
import {
  RARITY_COLOR,
  RARITY_LABEL,
  lockClosedIcon,
  lockOpenIcon,
} from "../../utils/rarity";
import { playUnlockSound } from "../../utils/sound";

const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

export default function LocationDetail({
  slug,
  onClose,
  onCheckIn,
  onUndo,
  onUpdate,
  autoCheckIn,
}) {
  const { lang } = useLang();
  const t = useT();
  const convert = useConvert();
  const { user, guest, updateUser } = useAuth();
  const navigate = useNavigate();
  const userPos = useUserPosition();
  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgFailed, setImgFailed] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [closing, setClosing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const autoCheckedIn = useRef(false);
  const prevUnlockedRef = useRef(null);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (loc === null) return;
    if (prevUnlockedRef.current === false && loc.unlocked === true) {
      setFlipping(true);
      playUnlockSound(loc.rarity);
    }
    prevUnlockedRef.current = loc.unlocked ?? null;
  }, [loc?.unlocked]);

  useEffect(() => {
    setLoading(true);
    setError("");
    locationAPI
      .getOne(slug)
      .then((res) => setLoc(res.data))
      .catch(() => setError("Failed to load location."))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!autoCheckIn || !loc || loc.unlocked || autoCheckedIn.current) return;
    autoCheckedIn.current = true;
    handleCheckIn();
  }, [loc, autoCheckIn]);

  // Close modal after success display; cancelled if user manually closes first
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [closing]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError("");
    try {
      const coords = await getCurrentPosition();
      const res = await checkinAPI.checkIn(slug, coords);
      setLoc((prev) => ({
        ...prev,
        unlocked: true,
        checkedInAt: new Date().toISOString(),
      }));
      setCheckInResult(res.data);
      updateUser({ totalXP: res.data.totalXP, explorerLevel: res.data.levelInfo.level });
      onCheckIn(slug, res.data); // update grid immediately
      setClosing(true); // start 2.5s close timer
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUndo = async () => {
    setActionLoading(true);
    setError("");
    try {
      const res = await checkinAPI.undo(slug);
      setLoc((prev) => ({ ...prev, unlocked: false, checkedInAt: null }));
      updateUser({ totalXP: res.data.totalXP, explorerLevel: res.data.levelInfo.level });
      onUndo(slug, res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to undo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdated = (updatedLoc) => {
    setLoc((prev) => ({ ...prev, ...updatedLoc }));
    setImgFailed(false);
    onUpdate?.(updatedLoc);
  };

  const description = convert(
    loc?.description?.[lang] || loc?.description?.en || "",
  );
  const TEASER = {
    zh: [
      "......",
      "🔒档案似乎被被锁住了...未完待续...",
      "这个地方等着你亲自到场来解锁完整档案，暂时不予剧透。",
      "“来吧，勇敢的探险家，我会一直等着你~”",
    ],
    en: [
      "......",
      "🔒The archive seems to be locked...To be continued...",
      "This location is waiting for you to unlock its full archive in person. No spoilers — yet.",
      '"Come on, brave adventurer, I will be waiting for you~"',
    ],
    cz: [
      "......",
      "🔒Soubor se zdá být uzamčený....Pokračování příště...",
      "Tento archiv zůstává utajen, dokud sem osobně nedorazíš. Zatím žádné spoilery.",
      '"Pojď, statečný dobrodruhu, budu na tebe čekat~"',
    ],
  };
  const locName = loc ? convert(getLocName(loc, lang)) : "";
  const art = loc ? getArt(loc.pixelArtKey, loc.labels) : "📍";
  const bgColor = loc ? LABEL_COLORS[loc.labels?.[0]] || "#1a2a5a" : "#1a2a5a";
  const distance =
    loc && userPos
      ? haversineDistance(userPos.lat, userPos.lng, loc.coordinates.lat, loc.coordinates.lng)
      : null;

  return (
    <div
      className="px-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="px-modal"
        style={
          loc
            ? { borderColor: RARITY_COLOR[loc.rarity ?? "common"] }
            : undefined
        }
      >
        <button className="px-modal__close" onClick={onClose}>
          ✕
        </button>

        {loading ? (
          <div
            style={{
              padding: 48,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div className="spinner" />
            <span
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: 8,
                color: "var(--text-muted)",
              }}
            >
              {t("common.loading")}
            </span>
          </div>
        ) : error ? (
          <div style={{ padding: 32, color: "#ff6b6b", fontSize: 16 }}>
            {error}
          </div>
        ) : loc ? (
          <>
            {loc.coverImage || !imgFailed ? (
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <div
                  className={flipping ? "detail-img-flip" : undefined}
                  style={{ position: "absolute", inset: 0 }}
                  onAnimationEnd={(e) => {
                    if (e.animationName === "card-flip") setFlipping(false);
                  }}
                >
                  <img
                    src={loc.coverImage || `/pixel-art/${loc.slug}.webp`}
                    alt={locName}
                    onError={() => setImgFailed(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: loc.unlocked ? undefined : "saturate(0.15)",
                    }}
                  />
                  {flipping ? (
                    <div className="loc-card__flip-overlay">
                      <img
                        className="loc-card__flip-lock"
                        src={lockClosedIcon(loc.rarity)}
                        alt=""
                      />
                      <img
                        className="loc-card__flip-unlock"
                        src={lockOpenIcon(loc.rarity)}
                        alt=""
                      />
                      <div className="loc-card__flip-shine" />
                    </div>
                  ) : (
                    !loc.unlocked && (
                      <img
                        src={lockClosedIcon(loc.rarity)}
                        alt=""
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "80%",
                          height: "auto",
                          imageRendering: "pixelated",
                          zIndex: 2,
                        }}
                      />
                    )
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "14px 18px",
                    background:
                      "linear-gradient(transparent, rgba(0,0,0,0.85))",
                    zIndex: 3,
                  }}
                >
                  <h2
                    className="px-title"
                    style={{
                      fontSize: 14,
                      marginBottom:
                        lang !== "cz" && loc.localizedNames?.cz ? 2 : 6,
                      color: RARITY_COLOR[loc.rarity ?? "common"],
                    }}
                  >
                    {locName}
                  </h2>
                  {lang !== "cz" && loc.localizedNames?.cz && (
                    <p
                      style={{
                        fontFamily: "'Press Start 2P'",
                        fontSize: 8,
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: 6,
                      }}
                    >
                      {loc.localizedNames.cz}
                    </p>
                  )}
                  {loc.unlocked && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 7,
                        color: "#8eff8e",
                        fontFamily: "'Press Start 2P'",
                      }}
                    >
                      {t("common.visited")}
                      {loc.checkedInAt &&
                        `${lang === "zh" ? "" : " "}${t("detail.at")}${lang === "zh" ? "" : " "}${formatDate(loc.checkedInAt)}`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-modal__header" style={{ background: bgColor }}>
                <div style={{ flexShrink: 0 }}>
                  <div
                    className={flipping ? "detail-img-flip" : undefined}
                    style={{ position: "relative" }}
                    onAnimationEnd={(e) => {
                      if (e.animationName === "card-flip") setFlipping(false);
                    }}
                  >
                    <span
                      className="detail-art"
                      style={{
                        filter:
                          !flipping && !loc.unlocked
                            ? "saturate(0.15)"
                            : undefined,
                        display: "block",
                      }}
                    >
                      {art}
                    </span>
                    {flipping ? (
                      <div className="loc-card__flip-overlay">
                        <img
                          className="loc-card__flip-lock"
                          src={lockClosedIcon(loc.rarity)}
                          alt=""
                        />
                        <img
                          className="loc-card__flip-unlock"
                          src={lockOpenIcon(loc.rarity)}
                          alt=""
                        />
                        <div className="loc-card__flip-shine" />
                      </div>
                    ) : (
                      !loc.unlocked && (
                        <img
                          src={lockClosedIcon(loc.rarity)}
                          alt=""
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            height: "auto",
                            imageRendering: "pixelated",
                            zIndex: 2,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    className="px-title"
                    style={{
                      fontSize: 14,
                      marginBottom:
                        lang !== "cz" && loc.localizedNames?.cz ? 2 : 10,
                      color: RARITY_COLOR[loc.rarity ?? "common"],
                    }}
                  >
                    {locName}
                  </h2>
                  {lang !== "cz" && loc.localizedNames?.cz && (
                    <p
                      style={{
                        fontFamily: "'Press Start 2P'",
                        fontSize: 8,
                        color: "rgba(255,255,255,0.6)",
                        marginBottom: 10,
                      }}
                    >
                      {loc.localizedNames.cz}
                    </p>
                  )}
                  {loc.unlocked && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 7,
                        color: "#8eff8e",
                        fontFamily: "'Press Start 2P'",
                      }}
                    >
                      {t("common.visited")}
                      {loc.checkedInAt &&
                        `${lang === "zh" ? "" : " "}${t("detail.at")}${lang === "zh" ? "" : " "}${formatDate(loc.checkedInAt)}`}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="px-modal__body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <LanguageSwitcher />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      background: RARITY_COLOR[loc.rarity ?? "common"],
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Press Start 2P'",
                      fontSize: 8,
                      color: RARITY_COLOR[loc.rarity ?? "common"],
                    }}
                  >
                    {convert(RARITY_LABEL[lang]?.[loc.rarity ?? "common"])}
                  </span>
                  <span style={{ fontSize: 16, color: "var(--gold)" }}>
                    +{loc.xpReward} XP
                  </span>
                  {distance != null && (
                    <span
                      style={{
                        fontFamily: "'Press Start 2P'",
                        fontSize: 7,
                        color: "var(--text-muted)",
                      }}
                    >
                      {t("detail.distanceAway", { dist: formatDistance(distance) })}
                    </span>
                  )}
                </div>
              </div>

              {(loc.labels || []).length > 0 && (
                <div className="loc-card__labels" style={{ marginBottom: 14 }}>
                  {(loc.labels || []).map((lb, i) => (
                    <span
                      key={lb}
                      className={`detail-label-pill${i === 0 ? " detail-label-pill--superior" : ""}`}
                      style={{
                        backgroundColor:
                          LABEL_COLORS[lb] || "rgba(255,255,255,0.07)",
                      }}
                    >
                      {convert(
                        LABEL_DEFINITIONS[lb]?.[lang] ||
                          LABEL_DEFINITIONS[lb]?.en ||
                          lb,
                      )}
                    </span>
                  ))}
                </div>
              )}

              {(() => {
                const paras = description
                  ? description.split("\n").filter((l) => l.trim())
                  : [];
                if (!paras.length)
                  return (
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 16,
                        marginBottom: 20,
                      }}
                    >
                      {t("common.noDesc")}
                    </p>
                  );
                const enParas = (loc?.description?.en || "")
                  .split("\n")
                  .filter((l) => l.trim());
                const firstEnWords = enParas[0]
                  ? enParas[0].trim().split(/\s+/).length
                  : 0;
                const showCount =
                  paras.length <= 3 || firstEnWords > 20 ? 1 : 2;
                const visible = !loc.unlocked
                  ? paras.slice(0, showCount)
                  : paras;
                return (
                  <div style={{ marginBottom: 20 }}>
                    {visible.map((para, i) => (
                      <p
                        key={i}
                        className="detail-desc"
                        style={{ marginBottom: 10 }}
                      >
                        {para}
                      </p>
                    ))}
                    {!loc.unlocked &&
                      (TEASER[lang] || TEASER.en).map((line, i, arr) => (
                        <p
                          key={i}
                          className="detail-desc"
                          style={{
                            marginBottom: i === arr.length - 1 ? 10 : 4,
                            color: "var(--text-muted)",
                            fontStyle: "italic",
                          }}
                        >
                          {convert(line)}
                        </p>
                      ))}
                  </div>
                );
              })()}

              <hr className="px-divider" />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {loc.wikipediaUrl && (
                  <a
                    className="detail-wiki"
                    href={loc.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("common.wikipedia")}
                  </a>
                )}
                <a
                  className="detail-wiki"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("common.googleMaps")}
                </a>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  {guest ? (
                    <button
                      className="px-btn px-btn--gold"
                      onClick={() => navigate("/login")}
                    >
                      {t("auth.loginToCollect")}
                    </button>
                  ) : checkInResult ? (
                    <div style={{ textAlign: "center", minWidth: 160 }}>
                      <p
                        style={{
                          fontFamily: "'Press Start 2P'",
                          fontSize: 9,
                          color: "#8eff8e",
                          marginBottom: 8,
                          letterSpacing: 1,
                        }}
                      >
                        COLLECTED!
                      </p>
                      <p
                        style={{
                          fontFamily: "'Press Start 2P'",
                          fontSize: 8,
                          color: "var(--gold)",
                        }}
                      >
                        +{checkInResult.xpEarned} XP
                      </p>
                      {checkInResult.newAchievements?.map((a) => (
                        <p
                          key={a.id}
                          style={{
                            fontFamily: "'Press Start 2P'",
                            fontSize: 6,
                            color: "#7ec8e3",
                            marginTop: 6,
                          }}
                        >
                          {a.id.replace(/_/g, " ")}
                        </p>
                      ))}
                    </div>
                  ) : loc.unlocked ? (
                    <button
                      className="px-btn px-btn--danger px-btn--sm"
                      onClick={handleUndo}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "..." : t("common.undoVisit")}
                    </button>
                  ) : (
                    <button
                      className="px-btn px-btn--gold"
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "..." : t("common.checkIn")}
                    </button>
                  )}
                </div>
              </div>
              {actionLoading && !checkInResult && (
                <p
                  style={{
                    fontFamily: "'Press Start 2P'",
                    fontSize: 7,
                    color: "var(--text-muted)",
                    marginTop: 10,
                  }}
                >
                  Locating...
                </p>
              )}
              {error && (
                <p style={{ color: "#ff6b6b", fontSize: 14, marginTop: 10 }}>
                  {error}
                </p>
              )}

              {user && !checkInResult && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #222",
                  }}
                >
                  <button
                    className="px-btn px-btn--outline px-btn--sm"
                    onClick={() => setShowEdit(true)}
                    disabled={actionLoading}
                  >
                    Edit
                  </button>
                  {loc.createdAt && (
                    <span
                      style={{
                        fontSize: 7,
                        color: "var(--gold)",
                        fontFamily: "'Press Start 2P'",
                      }}
                    >
                      {`${t("detail.added")}${lang === "zh" ? "" : " "}${t("detail.at")}${lang === "zh" ? "" : " "}${formatDate(loc.createdAt)}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {showEdit && loc && (
        <EditLocationForm
          location={loc}
          onClose={() => setShowEdit(false)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
