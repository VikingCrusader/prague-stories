import { useState, useEffect, useRef } from "react";
import { loadLocation, forgetLocation, initialLocation } from "../../utils/locationCache";
import { useModalEntrance } from "../../hooks/useModalEntrance";
import { useNavigate } from "react-router-dom";
import { checkinAPI } from "../../services/api";
import { useLang, useT, useConvert } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import {
  getArt,
  LABEL_DEFINITIONS,
  LABEL_COLORS,
} from "../../utils/pixelArtMap";
import { getLocalCoverPath, toThumbPath, toCloudThumbUrl } from "../../utils/localCover";
import { getLocName } from "../../utils/locName";
import { getCurrentPosition, haversineDistance, formatDistance } from "../../utils/geolocation";
import { useUserPosition } from "../../hooks/useUserPosition";
import EditLocationForm from "./EditLocationForm";
import DistrictLine, { descriptiveLabels } from "./DistrictLine";
import TagButton from "./TagInfo";
import PackLinks from "../packs/PackLinks";
import {
  RARITY_VAR,
  RARITY_LABEL, RARITY_ICON,
  lockClosedIcon,
  lockOpenIcon,
} from "../../utils/rarity";
import { playUnlockSound } from "../../utils/sound";

const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

// Grey lines where text is on its way.
const SkeletonLines = ({ widths }) => (
  <div className="detail-skeleton" aria-hidden="true">
    {widths.map((w, i) => (
      <span key={i} className="detail-skeleton__line" style={{ width: `${w}%` }} />
    ))}
  </div>
);
const STORY_LINES = [100, 96, 99, 62, 0, 100, 94, 98, 97, 45];

// `preview`: the card as the list already has it (everything but the story).
// With it, or with a copy kept from an earlier visit, the window opens filled
// in at once and only the story waits for the request (2026-11-12).

export default function LocationDetail({
  slug,
  preview = null,
  onClose,
  onCheckIn,
  onUpdate,
  autoCheckIn,
  fromPack = null,
}) {
  const { lang } = useLang();
  const t = useT();
  const convert = useConvert();
  const { user, guest, applyProgress } = useAuth();
  const navigate = useNavigate();
  const userPos = useUserPosition();
  const [loc, setLoc] = useState(() => initialLocation(slug, preview));
  // The request is back: until then `loc` may be the list's card or an old copy.
  const [full, setFull] = useState(false);
  const { overlayRef, modalRef, close } = useModalEntrance(slug, onClose);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [localFailed, setLocalFailed] = useState(false);
  const [cloudFailed, setCloudFailed] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const autoCheckedIn = useRef(false);
  const [flipping, setFlipping] = useState(false);
  // The card's thumbnail stands in until the full-size cover has loaded.
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  // The story was there when the window opened, so it needn't fade in.
  const storyAtOpen = useRef(loc?.description !== undefined);

  useEffect(() => {
    let live = true;
    setFull(false);
    setError("");
    setLocalFailed(false);
    setCloudFailed(false);
    setCoverLoaded(false);
    setThumbFailed(false);
    setLoc((prev) => (prev?.slug === slug ? prev : initialLocation(slug, preview)));
    loadLocation(slug).then(
      (data) => {
        if (!live) return;
        setLoc((prev) => ({ ...(prev?.slug === slug ? prev : null), ...data }));
        setFull(true);
      },
      () => live && setError("Failed to load location."),
    );
    return () => {
      live = false;
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!autoCheckIn || !full || !loc || loc.unlocked || autoCheckedIn.current) return;
    autoCheckedIn.current = true;
    handleCheckIn();
  }, [loc, full, autoCheckIn]);

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
        guessAttempt: res.data.guessAttempt,
        huntMode: res.data.huntMode,
        xpEarned: res.data.xpEarned,
      }));
      setFlipping(true);
      playUnlockSound(loc?.rarity);
      setCheckInResult(res.data);
      // The server only sent a preview of the story until now: fetch it whole.
      loadLocation(slug, { fresh: true })
        .then((r) => setLoc((prev) => ({ ...prev, description: r.description, storyLocked: r.storyLocked })))
        .catch(() => {});
      applyProgress(res.data.levelInfo, res.data.totalXP);
      onCheckIn(slug, res.data); // update grid immediately
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdated = (updatedLoc) => {
    setLoc((prev) => ({ ...prev, ...updatedLoc }));
    forgetLocation(slug);
    setLocalFailed(false);
    setCloudFailed(false);
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
  const localCover = loc ? getLocalCoverPath(loc.slug, loc.coverImage) : null;
  const useLocalCover = !!localCover && !localFailed;
  const useCloudCover = !useLocalCover && !!loc?.coverImage && !cloudFailed;
  const coverSrc = useLocalCover ? localCover : loc?.coverImage;
  const thumbSrc = useLocalCover ? toThumbPath(localCover) : toCloudThumbUrl(loc?.coverImage);
  const hasStory = loc?.description !== undefined;
  const mapHref = loc
    ? `https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`
    : null;
  // Unlocked cards keep the whole image clickable to Google Maps; locked
  // cards only navigate via the lock icon (see the `!loc.unlocked` branch
  // below), so the wrapper itself must not also be a link there.
  const ImgWrap = loc?.unlocked ? "a" : "div";
  const distance =
    loc && userPos
      ? haversineDistance(userPos.lat, userPos.lng, loc.coordinates.lat, loc.coordinates.lng)
      : null;

  return (
    <div
      className="px-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="px-modal px-modal--detail"
        ref={modalRef}
        style={
          loc
            ? { borderColor: RARITY_VAR[loc.rarity ?? "common"] }
            : undefined
        }
      >
        <button className="px-modal__close" onClick={close}>
          ✕
        </button>

        {loc ? null : error ? (
          <div style={{ padding: 32, color: "var(--danger-text, #ff6b6b)", fontSize: 16 }}>
            {error}
          </div>
        ) : (
          /* Nothing known about the card yet: its outline, no spinner. */
          <div role="status" aria-label={t("common.loading")}>
            <div className="detail-cover detail-skeleton__cover" />
            <div className="px-modal__body">
              <SkeletonLines widths={[38, 70, 52]} />
              <div className="detail-story-wait">
                <SkeletonLines widths={STORY_LINES} />
              </div>
            </div>
          </div>
        )}
        {loc ? (
          <>
            {useLocalCover || useCloudCover ? (
              <ImgWrap
                {...(loc.unlocked
                  ? {
                      href: mapHref,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      title: t("common.googleMaps"),
                    }
                  : {})}
                className="detail-cover"
                style={{
                  cursor: loc.unlocked ? "pointer" : undefined,
                }}
              >
                <div
                  className={flipping ? "detail-img-flip" : undefined}
                  style={{ position: "absolute", inset: 0 }}
                  onAnimationEnd={(e) => {
                    if (e.animationName === "card-flip") setFlipping(false);
                  }}
                >
                  {!coverLoaded && !thumbFailed && thumbSrc && (
                    <img
                      src={thumbSrc}
                      alt=""
                      aria-hidden="true"
                      onError={() => setThumbFailed(true)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: loc.unlocked ? undefined : "saturate(0.15)",
                      }}
                    />
                  )}
                  <img
                    key={coverSrc}
                    src={coverSrc}
                    alt={locName}
                    onLoad={() => setCoverLoaded(true)}
                    onError={() =>
                      useLocalCover ? setLocalFailed(true) : setCloudFailed(true)
                    }
                    style={{
                      position: "relative",
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
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t("common.googleMaps")}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "80%",
                          zIndex: 2,
                          cursor: "pointer",
                        }}
                      >
                        <img
                          src={lockClosedIcon(loc.rarity)}
                          alt=""
                          style={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                            imageRendering: "pixelated",
                          }}
                        />
                      </a>
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
                      "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9))",
                    paddingTop: 36,
                    zIndex: 3,
                  }}
                >
                  <h2
                    className="px-title detail-title-name"
                    style={{
                      /* Size, weight and shadow live in .detail-title-name
                         (pixelart.css). The name always sits on a dark
                         background (cover gradient or label colour), so it
                         uses the bright rarity colours in both themes. */
                      marginBottom: loc.localizedNames?.cz ? 4 : 6,
                      color: `var(--rarity-on-dark-${loc.rarity ?? "common"})`,
                    }}
                  >
                    {locName}
                  </h2>
                  {lang !== "cz" && loc.localizedNames?.cz && (
                    <p
                      className="detail-title-czname"
                      style={{
                        fontFamily: "var(--ui-font)",
                        fontSize: 16,
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: 6,
                      }}
                    >
                      {loc.localizedNames.cz}
                    </p>
                  )}
                  {loc.unlocked && (
                    <span
                      className="detail-collected"
                      style={{
                        marginLeft: 8,
                        fontSize: 13,
                        color: "#8eff8e",
                        fontFamily: "var(--ui-font)",
                      }}
                    >
                      {t("common.visited")}
                      {loc.checkedInAt &&
                        `${lang === "zh" ? "" : " "}${t("detail.at")}${lang === "zh" ? "" : " "}${formatDate(loc.checkedInAt)}`}
                      {loc.guessAttempt > 0 && loc.xpEarned != null && t(loc.huntMode === "hardcore" ? "detail.huntFindHardcore" : "detail.huntFind", { n: loc.guessAttempt, xp: loc.xpEarned })}
                    </span>
                  )}
                </div>
              </ImgWrap>
            ) : (
              <div className="px-modal__header" style={{ background: bgColor }}>
                <ImgWrap
                  {...(loc.unlocked
                    ? {
                        href: mapHref,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        title: t("common.googleMaps"),
                      }
                    : {})}
                  style={{
                    flexShrink: 0,
                    display: "block",
                    cursor: loc.unlocked ? "pointer" : undefined,
                  }}
                >
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
                        <a
                          href={mapHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t("common.googleMaps")}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            zIndex: 2,
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={lockClosedIcon(loc.rarity)}
                            alt=""
                            style={{
                              display: "block",
                              width: "100%",
                              height: "auto",
                              imageRendering: "pixelated",
                            }}
                          />
                        </a>
                      )
                    )}
                  </div>
                </ImgWrap>
                <div style={{ flex: 1 }}>
                  <h2
                    className="px-title detail-title-name"
                    style={{
                      /* Size, weight and shadow live in .detail-title-name
                         (pixelart.css). The name always sits on a dark
                         background (cover gradient or label colour), so it
                         uses the bright rarity colours in both themes. */
                      marginBottom: loc.localizedNames?.cz ? 4 : 10,
                      color: `var(--rarity-on-dark-${loc.rarity ?? "common"})`,
                    }}
                  >
                    {locName}
                  </h2>
                  {lang !== "cz" && loc.localizedNames?.cz && (
                    <p
                      className="detail-title-czname"
                      style={{
                        fontFamily: "var(--ui-font)",
                        fontSize: 16,
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: 10,
                      }}
                    >
                      {loc.localizedNames.cz}
                    </p>
                  )}
                  {loc.unlocked && (
                    <span
                      className="detail-collected"
                      style={{
                        marginLeft: 8,
                        fontSize: 13,
                        color: "#8eff8e",
                        fontFamily: "var(--ui-font)",
                      }}
                    >
                      {t("common.visited")}
                      {loc.checkedInAt &&
                        `${lang === "zh" ? "" : " "}${t("detail.at")}${lang === "zh" ? "" : " "}${formatDate(loc.checkedInAt)}`}
                      {loc.guessAttempt > 0 && loc.xpEarned != null && t(loc.huntMode === "hardcore" ? "detail.huntFindHardcore" : "detail.huntFind", { n: loc.guessAttempt, xp: loc.xpEarned })}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="px-modal__body">
              <div
                className="loc-meta-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      background: RARITY_VAR[loc.rarity ?? "common"],
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                  />
                  <TagButton
                    kind="rarity"
                    value={loc.rarity ?? "common"}
                    className="loc-meta__rarity"
                    style={{ color: RARITY_VAR[loc.rarity ?? "common"] }}
                  >
                    {RARITY_ICON[loc.rarity ?? "common"]}{" "}
                    {convert(RARITY_LABEL[lang]?.[loc.rarity ?? "common"])}
                  </TagButton>
                  <span className="loc-meta__xp" style={{ color: "var(--gold)" }}>
                    +{loc.xpReward} XP
                  </span>
                </div>
                {distance != null && (
                  <span
                    className="loc-meta__distance"
                    style={{ color: RARITY_VAR[loc.rarity ?? "common"] }}
                  >
                    {t("detail.distanceAway", { dist: formatDistance(distance) })}
                  </span>
                )}
              </div>

              {descriptiveLabels(loc.labels).length > 0 && (
                <div className="loc-card__labels" style={{ marginBottom: 8 }}>
                  {descriptiveLabels(loc.labels).map((lb, i) => (
                    <TagButton
                      key={lb}
                      kind="label"
                      value={lb}
                      className={`detail-label-pill area-guide-pill${i === 0 ? " detail-label-pill--superior" : ""}`}
                      style={{
                        backgroundColor:
                          LABEL_COLORS[lb] || "var(--pill-fallback, rgba(255,255,255,0.07))",
                      }}
                    >
                      {convert(
                        LABEL_DEFINITIONS[lb]?.[lang] ||
                          LABEL_DEFINITIONS[lb]?.en ||
                          lb,
                      )}
                    </TagButton>
                  ))}
                </div>
              )}

              <DistrictLine loc={loc} style={{ marginBottom: loc.packs?.length ? 8 : 14 }} />
              <PackLinks packs={loc.packs} fromPack={fromPack} onBack={close} style={{ marginBottom: 14 }} />

              {!hasStory ? (
                /* The story is on its way; the rest is already here. */
                !error && (
                  <div className="detail-story-wait" role="status" aria-label={t("common.loading")}>
                    <SkeletonLines widths={STORY_LINES} />
                  </div>
                )
              ) : (() => {
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
                // storyLocked: the server already cut it to the preview.
                const visible = loc.unlocked || loc.storyLocked
                  ? paras
                  : paras.slice(0, showCount);
                return (
                  <div
                    className={storyAtOpen.current ? undefined : "detail-story-in"}
                    style={{ marginBottom: 20 }}
                  >
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
                          className="detail-desc detail-desc--teaser"
                          style={{
                            marginBottom: i === arr.length - 1 ? 10 : 4,
                            color: "var(--text-muted)",
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
                          fontFamily: "var(--ui-font)",
                          fontSize: 15,
                          color: "var(--success-text, #8eff8e)",
                          marginBottom: 8,
                          letterSpacing: 1,
                        }}
                      >
                        COLLECTED!
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--ui-font)",
                          fontSize: 14,
                          color: "var(--gold)",
                        }}
                      >
                        +{checkInResult.xpEarned} XP
                      </p>
                      {checkInResult.bonusApplied && (
                        <p
                          style={{
                            fontFamily: "var(--ui-font)",
                            fontSize: 12,
                            color: "var(--pink-text, #ff8ed6)",
                            marginTop: 6,
                          }}
                        >
                          {t("detail.bonusApplied")}
                        </p>
                      )}
                    </div>
                  ) : loc.unlocked ? null : (
                    <button
                      className="px-btn px-btn--gold"
                      onClick={handleCheckIn}
                      disabled={actionLoading || !full}
                    >
                      {actionLoading ? "..." : t("common.checkIn")}
                    </button>
                  )}
                </div>
              </div>
              {actionLoading && !checkInResult && (
                <p
                  style={{
                    fontFamily: "var(--ui-font)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginTop: 10,
                  }}
                >
                  Locating...
                </p>
              )}
              {error && (
                <p style={{ color: "var(--danger-text, #ff6b6b)", fontSize: 14, marginTop: 10 }}>
                  {error}
                </p>
              )}

              {!checkInResult && (user || loc.createdAt) && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: user ? "space-between" : "flex-end",
                    alignItems: "center",
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid var(--divider, #222)",
                  }}
                >
                  {user?.isAdmin && (
                    <button
                      className="px-btn px-btn--outline px-btn--sm"
                      onClick={() => setShowEdit(true)}
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                  )}
                  {loc.createdAt && (
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--gold)",
                        fontFamily: "var(--ui-font)",
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
