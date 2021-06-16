import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SitemapService } from './sitemap.service';

@ApiTags('Sitemap')
@Controller('sitemap.xml')
export class SitemapController {
    constructor(private readonly SitemapService: SitemapService) {
    }

    @Get()
    @Header('Content-Type', 'application/xml')
    getSitemap() {
        return this.SitemapService.generateSitemap();
    }
}
