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

declare global {
  interface Window {
    electronAPI: {
      saveImage: (
        url: string,
        gameName: string
      ) => Promise<{ success: boolean; error?: string }>;
    };
  }
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
    if (!clientId || !clientSecret)
      return alert("IDとSecretを入力してください");
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
      } else {
        alert("ゲームが見つかりませんでした");
      }
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!gameData) return;
    const result = await window.electronAPI.saveImage(
      gameData.box_art_url,
      gameData.name
    );
    if (result.success) {
      alert("保存が完了しました！");
    } else if (result.error) {
      alert("保存に失敗しました: " + result.error);
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#9146FF]">
            Twitch Banner
          </CardTitle>
          <CardDescription className="text-center">
            ゲームの公式バナーを取得・保存します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Client ID</Label>
            <Input
              id="id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret">Client Secret</Label>
            <Input
              id="secret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="game">Game Name</Label>
            <Input
              id="game"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-[#9146FF] hover:bg-[#772ce8]"
            onClick={getBanner}
            disabled={loading}
          >
            {loading ? "取得中..." : "バナーを取得"}
          </Button>

          {gameData && (
            <div className="mt-6 animate-in fade-in zoom-in duration-300 space-y-4 text-center">
              <h3 className="text-lg font-semibold">{gameData.name}</h3>
              <img
                src={gameData.box_art_url}
                alt={gameData.name}
                className="w-full rounded-md shadow-md border"
              />
              <Button variant="outline" className="w-full" onClick={handleSave}>
                画像を保存する
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
