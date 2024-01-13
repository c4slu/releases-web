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

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  console.log(isMobileDevice);

  return (
    <main className="flex h-screen max-w-screen min-h-screen min-w-screen flex-col xl:bg-grid md:bg-grid  md:bg-cover bg-center overflow-x-hidden">
      <Navbar />
      <div className="flex justify-center h-2/4 mt-20">
        <div className="flex w-2/3 xl:flex-row md:flex-row flex-col h-1/2  gap-20 items-center mt-6">
          <div className="flex w-2/3 flex-col gap-2 xl:items-start md:items-center xl:text-start md:text-start text-center items-center justify-center z-10">
            <div className="bg-gradient-to-r from-green-800 via-yellow-700 to-violet-700  rounded-full p-[1px] w-[12rem] -z-50">
              <Link
                href={"https://developer.spotify.com/documentation/web-api"}
                target="_blank"
              >
                <div className="">
                  <Badge
                    variant="secondary"
                    className="flex h-full w-full items-center py-0.5 gap-2 font-normal text-[13.5px] bg-background justify-center"
                  >
                    <Image
                      src={"/spotify.webp"}
                      alt=""
                      width={15}
                      height={15}
                    />
                    Spotify API
                    <ChevronRight width={15} />
                  </Badge>
                </div>
              </Link>
            </div>
            <h1 className="w-2/3 lg:text-3xl md:text-2xl text-base font-semibold ">
              Qual artista você deseja ver os lançamentos?
            </h1>
            <div className="w-3/4">
              <form action={""}>
                <div className="flex flex-col xl:flex-col md:flex-row justify-center gap-2">
                  <Input
                    type="text"
                    className="h-full md:h-10 lg:h-10 focus:touch-pinch-zoom "
                    placeholder="Qual o artista que você vai querer ver os lancamentos?"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <Button
                    type="submit"
                    className="h-10 hidden"
                    disabled={
                      !search || search === undefined || tipo === undefined
                    }
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
                    <SelectTrigger className="w-full">
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
          <div
            className={`flex w-2/3 h-[530px] overflow-hidden  xl:relative md:relative absolute justify-center xl:items-center md:items-center items-start overflow-x-hidden `}
          >
            <HeadphoneScene divHeight={1} divWidth={1} />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="relative -top-1/2 left-[35%] bg-background rounded-xl border border-b-[#1FC758]/90 border-t-white/40 z-10 p-3 shadow-xl shadow-black/50 drop-shadow-xl">
          <Image src={"/spotify.webp"} alt="" width={32} height={32} />
        </div>
        <div className="w-2/3 border-t border-collapse h-44 rounded-2xl flex justify-center overflow-hidden">
          <span className="w-20 h-14 rounded-full bg-white blur-3xl relative -top-1/2"></span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col w-full items-center justify-center gap-6 z-10">
          <div className="w-2/3 flex items-center md:justify-start lg:justify-start justify-center">
            <div className="flex flex-col xl:flex-row md:flex-row gap-4 w-1/2 ">
              <div className="flex items-center gap-2">
                <Skeleton className=" w-10 h-10 rounded-full" />
                <Skeleton className=" w-[100px] h-[20px] rounded-full" />
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Badge variant="secondary" />
                <Badge variant="secondary" />
                <Badge variant="secondary" />
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 w-2/3 max-w-screen gap-8 auto-rows-max mb-20 md:justify-start lg:justify-start justify-center">
              <Skeleton className=" w-[150px] h-[150px] rounded" />
              <Skeleton className=" w-[150px] h-[150px] rounded" />
              <Skeleton className=" w-[150px] h-[150px] rounded" />
              <Skeleton className=" w-[150px] h-[150px] rounded" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full items-center justify-center gap-6 z-10">
          <div className="w-2/3 flex items-center md:justify-start lg:justify-start justify-center">
            <div className="flex flex-col xl:flex-row md:flex-row gap-4 w-1/2 ">
              <div className="flex  items-center gap-2 ">
                <a
                  href={`${
                    artist?.external_urls.spotify === undefined
                      ? ""
                      : artist?.external_urls.spotify
                  }`}
                  target="_blank"
                  className="flex gap-2 w-full flex-col xl:flex-row md:flex-row justify-center items-center"
                >
                  <Avatar>
                    <AvatarImage
                      src={`${
                        artist?.images[0].url === undefined
                          ? ``
                          : artist?.images[0].url
                      }`}
                      alt="caslu"
                      width={100}
                      height={100}
                      className="bg-cover rounded-full w-12 h-12"
                    />
                  </Avatar>
                  <h1 className="text-2xl flex gap-2 font-semibold items-center hover:underline transition-all">
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
                </a>
              </div>
              <div className="flex gap-2 items-center justify-center">
                {artist?.genres.map((genre, index) => (
                  <Badge variant="secondary" key={index}>{`${
                    genre.toUpperCase().split(" ")[0]
                  }`}</Badge>
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
                      className="flex w-full justify-center items-center rounded "
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
