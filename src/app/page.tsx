"use client";
import Image from "next/image";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "@/utils/spotifyConfig";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Link2, LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface SpotifyConfig {
  Token: String;
}

interface Albums {
  id: string;
  name: string;
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };

  images: { url: string }[];
}

interface Artist {
  id: string;
  name: string;
  link: string;
  genres: string[];
  external_urls: { spotify: string };
  images: { url: string }[];
}
export default function Home() {
  const [Token, setToken] = useState([]);
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState<Artist>();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function Response() {
      await axios
        .post("https://accounts.spotify.com/api/token", null, {
          params: {
            grant_type: "client_credentials",
          },
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        })
        .then((response) => {
          setToken(response.data.access_token);
          localStorage.setItem("token", response.data.access_token);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    Response();
  }, []);

  async function getAlbumsArtits(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setLoading(true);
    await axios
      .get(`https://api.spotify.com/v1/search?q=${search}&type=artist`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setArtist(response.data.artists.items[0]);
        console.log(artist);

        axios
          .get(
            `https://api.spotify.com/v1/artists/${response.data.artists.items[0].id}/albums?album_type=album`,
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            }
          )
          .then((response) => {
            setAlbums(response.data.items);
            console.log(albums);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <main className="flex h-screen max-w-screen min-h-screen min-w-screen flex-col">
      <Navbar />
      <div className=" flex flex-col gap-5 items-center justify-center mt-32">
        <h1 className="text-3xl font-semibold text-center">
          Qual artista você deseja ver os lançamentos?
        </h1>
        <div>
          <form action={""}>
            <div className="flex w-[700px] items-center space-x-2">
              <Input
                type="text"
                className="h-10"
                placeholder="Qual o artista que você vai querer ver os lancamentos?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                type="submit"
                className="h-10 hidden"
                disabled={!search}
                onClick={getAlbumsArtits}
              >
                Pesquisar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col w-full justify-center items-center mt-20 gap-6 ">
          <div className="w-2/3 flex gap-4 items-center">
            <Skeleton className=" w-14 h-14 rounded-full" />
            <Skeleton className=" w-[100px] h-[20px] rounded-full" />
          </div>
          <div className="grid grid-cols-4 w-2/3 max-w-screen gap-8 auto-rows-max">
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
            <Skeleton className=" w-[295px] h-[344px] rounded" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center mt-20 gap-6 ">
          <div className="w-2/3 flex gap-4 items-center">
            <Link href={`${artist?.external_urls.spotify}`} target="_blank">
              <h1 className="text-2xl flex gap-2 font-semibold items-center hover:underline transition-all">
                <Avatar>
                  <AvatarImage
                    src={`${artist?.images[0].url}`}
                    className="bg-cover rounded-full w-14 h-14"
                  />
                  <AvatarFallback>{artist?.name}</AvatarFallback>
                </Avatar>
                {artist?.name}
              </h1>
            </Link>
            <div className="flex gap-2 items-center ">
              {artist?.genres.map((genre, index) => (
                <Badge
                  variant="secondary"
                  key={index}
                >{`${genre.toUpperCase()}`}</Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 w-2/3 max-w-screen gap-8 auto-rows-max mb-20">
            {albums.map((album: Albums, index) => (
              <Card
                key={index}
                className="hover:bg-[#222222] bg-[#191919] transition-colors border-none"
              >
                <Link href={`${album.external_urls.spotify}`} target="_blank">
                  <CardHeader className="flex flex-col justify-center ">
                    <Image
                      src={album.images[0].url}
                      alt=""
                      width={200}
                      height={200}
                      className="flex w-full justify-center items-center rounded"
                    />

                    <h1 className="text-sm line-clamp-1">{album.name}</h1>
                    <h1 className="text-xs">
                      {album.release_date} • {album.total_tracks} Musicas
                    </h1>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* <div className="w-screen flex flex-col items-center justify-center mt-32">
        <div className="flex w-[800px] text-muted-foreground items-center gap-2">
          <Clock />
          <h1 className="font-semibold text-start">Pesquisas Anteriores</h1>
        </div>
      </div> */}
      <div className="-z-10 bg-primary/10 absolute -top-2/4 left-1/2 -translate-x-[50%] w-[1080px] h-[720px] rounded-full blur-3xl"></div>
    </main>
  );
}
