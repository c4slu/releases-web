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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import HeadphoneScene from "@/components/cube";


interface Albums {
  id: string;
  name: string;
  release_date: string;
  total_tracks: number;
  external_urls: { spotify: string };
  images: { url: string }[];
  album_type: string;
}

interface Artist {
  id: string;
  name: string;
  link: string;
  genres: string[];
  external_urls: { spotify: string };
  images: { url: string }[];
  followers: {
    total: number;
  };
}
export default function Home() {
  const [Token, setToken] = useState([]);
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState<Artist>();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState("");

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
          console.log(response.data.access_token);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    Response();
  }, []);

  async function getAlbumsArtits(
    event?: React.MouseEvent<HTMLButtonElement>,
    tipo?: string
  ) {
    event?.preventDefault();
    setLoading(true);
    await axios
      .get(`https://api.spotify.com/v1/search?q=${search}&type=artist`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })
      .then((response) => {
        setArtist(response.data.artists.items[0]);

        axios
          .get(
            `https://api.spotify.com/v1/artists/${
              response.data.artists.items[0].id
            }/albums${
              tipo === "all"
                ? ""
                : tipo === "album"
                ? "?album_type=album"
                : "?album_type=single"
            }`,
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            }
          )
          .then((response) => {
            setLoading(false);
            setAlbums(response.data.items);
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
        if (
          err.response === undefined ||
          err.response.data.error.message === "No search query" ||
          err.response.data.error.message === "Missing parameter type"
        ) {
          setLoading(false);
          toast.error(
            "Artista não encontrado. Utilize um nome correto e evite caracteres especiais.",
            {
              description: `Nome pesquisado: ${search}`,
            }
          );
          setAlbums([]);
          setArtist(undefined);
        } else {
          setLoading(false);
          setAlbums([]);
          setArtist(undefined);
          console.log(err);
          toast.error("Tivemos algum erro em nossa API, tente mais tarde.");
        }
      });
  }

  return (
    <main className="flex h-screen max-w-screen min-h-screen min-w-screen flex-col overflow-hidden" >
      <Navbar />
      <div className="flex flex-col gap-2 items-center justify-center  ">
        <div className="relative top-14 ">
        <div className="bg-gradient-to-r w-96 h-24 absolute -z-10 from-green-800 via-yellow-700 to-violet-700 rounded-full p-[.9px] blur-3xl backdrop-blur-3xl"></div>
        <HeadphoneScene />
        </div>
        {/* <Image src={'/music.svg'} alt="" width={200} height={200} className="transform animate-rotate "/> */}
        <div className="bg-gradient-to-r from-green-800 via-yellow-700 to-violet-700 rounded-full p-[.9px]">
        <Badge variant="secondary" className="flex h-full w-full items-center py-1.5 font-normal text-[13.5px] bg-background justify-center ">Veja os ultimos lancamentos dos seus artistas preferidos <ChevronRight width={15}/></Badge>
        </div>
        <h1 className="w-3/4 lg:text-4xl md:text-3xl text-xl font-semibold text-center">
          Qual artista você deseja ver os lançamentos? 
        </h1>
        <div className="w-3/4">
          <form action={""}>
            <div className="flex items-center space-x-2">
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
                disabled={!search || search === undefined || tipo === undefined}
                onClick={getAlbumsArtits}
              >
                Pesquisar
              </Button>
              <Select
                onValueChange={(value: string) => {
                  setTipo(value);
                  getAlbumsArtits(undefined, value);
                }}
                value={tipo}
                disabled={!search}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="album" defaultValue={"album"}>
                    Albums
                  </SelectItem>
                  <SelectItem value="single">Singles</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
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
          <div className="w-2/3 flex gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Link
                href={`${
                  artist?.external_urls.spotify === undefined
                    ? ""
                    : artist?.external_urls.spotify
                }`}
                target="_blank"
              >
                <h1 className="text-2xl flex gap-2 font-semibold items-center hover:underline transition-all">
                  <Avatar>
                    <AvatarImage
                      src={`${
                        artist?.images[0].url === undefined
                          ? ""
                          : artist?.images[0].url
                      }`}
                      className="bg-cover rounded-full w-14 h-14"
                    />
                    <AvatarFallback>{artist?.name}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p>{artist?.name}</p>
                    <div className="flex gap-1">
                      <p className="text-xs flex">
                        {artist?.followers.total.toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      {artist && <p className="text-xs">Seguidores</p>}
                    </div>
                  </div>
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
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 w-2/3 max-w-screen gap-8 auto-rows-max mb-20">
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
                    <div className="flex flex-col pt-4">
                      <div className="flex justify-between">
                        <h1 className="text-sm line-clamp-1">{album.name}</h1>
                        <div className="flex justify-end">
                          <Badge
                            className="flex w-14 items-center justify-center"
                            variant="secondary"
                          >
                            {album.album_type}
                          </Badge>
                        </div>
                      </div>
                      <h1 className="text-xs">
                        {album.release_date} • {album.total_tracks} Musicas
                      </h1>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
