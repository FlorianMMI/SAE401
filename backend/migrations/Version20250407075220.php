<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250407075220 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_blocked (user_id INT NOT NULL, blocked_user_id INT NOT NULL, INDEX IDX_8258F58AA76ED395 (user_id), INDEX IDX_8258F58A1EBCBB63 (blocked_user_id), PRIMARY KEY(user_id, blocked_user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_blocked ADD CONSTRAINT FK_8258F58AA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_blocked ADD CONSTRAINT FK_8258F58A1EBCBB63 FOREIGN KEY (blocked_user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_blocked DROP FOREIGN KEY FK_8258F58AA76ED395');
        $this->addSql('ALTER TABLE user_blocked DROP FOREIGN KEY FK_8258F58A1EBCBB63');
        $this->addSql('DROP TABLE user_blocked');
    }
}
