import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface TwitchGame {
  name: string;
  box_art_url: string;
}

export default function App() {
  const [clientId, setClientId] = useState(
    () => localStorage.getItem("twitch_client_id") || ""
  );
  const [clientSecret, setClientSecret] = useState(
    () => localStorage.getItem("twitch_client_secret") || ""
  );
  const [gameName, setGameName] = useState("Apex Legends");
  const [gameData, setGameData] = useState<TwitchGame | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("twitch_client_id", clientId);
    localStorage.setItem("twitch_client_secret", clientSecret);
  }, [clientId, clientSecret]);

  const getBanner = async () => {
    setLoading(true);
    try {
      const tokenParams = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      });

      const tokenRes = await fetch(
        `https://id.twitch.tv/oauth2/token?${tokenParams}`,
        { method: "POST" }
      );
      const { access_token } = await tokenRes.json();

      const gameRes = await fetch(
        `https://api.twitch.tv/helix/games?name=${encodeURIComponent(
          gameName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Client-Id": clientId,
          },
        }
      );
      const resData = await gameRes.json();

      if (resData.data?.[0]) {
        const game = resData.data[0];
        setGameData({
          name: game.name,
          box_art_url: game.box_art_url.replace("{width}x{height}", "600x800"),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-[#9146FF]">
            Twitch Banner
          </CardTitle>
          <CardDescription className="text-center">
            API情報を入力してバナーを取得します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-id">Client ID</Label>
            <Input
              id="client-id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="xxxxxxxxxxxxxx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-secret">Client Secret</Label>
            <Input
              id="client-secret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="game-name">Game Name</Label>
            <Input
              id="game-name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-[#9146FF] hover:bg-[#772ce8]"
            onClick={getBanner}
            disabled={loading}
          >
            {loading ? "Loading..." : "バナーを取得"}
          </Button>

          {gameData && (
            <div className="mt-6 animate-in fade-in zoom-in duration-300">
              <h3 className="text-lg font-semibold mb-2 text-center">
                {gameData.name}
              </h3>
              <img
                src={gameData.box_art_url}
                alt={gameData.name}
                className="w-full rounded-md shadow-md border"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
